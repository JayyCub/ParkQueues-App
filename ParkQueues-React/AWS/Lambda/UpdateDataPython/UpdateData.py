import json
import threading
from datetime import datetime, timedelta
import requests
import boto3

# Global S3 client and bucket name
s3_client = boto3.client('s3')
BUCKET_NAME = 'test-wait-times-data'

def data_update(dest):
    """Fetch, update, and upload destination data for a single destination."""
    try:
        print(f"Starting update for destination: {dest['slug']}")
        current_time = int(datetime.now().timestamp() * 1000)
        
        # Initialize default destination data
        dest_data = {
            "id": dest["id"],
            "name": dest["name"],
            "slug": dest["slug"],
            "lastUpdated": current_time,
            "parks": {}
        }
        
        s3_key = f"{dest['slug']}.json"
        # Attempt to retrieve existing data from S3
        try:
            response = s3_client.get_object(Bucket=BUCKET_NAME, Key=s3_key)
            data_str = response['Body'].read().decode('utf-8')
            dest_data = json.loads(data_str)
            dest_data["lastUpdated"] = current_time
            print(f"[{dest['slug']}] Successfully retrieved {s3_key} from S3.")
        except s3_client.exceptions.NoSuchKey:
            print(f"[{dest['slug']}] {s3_key} not found in S3. Creating new data.")
        except Exception as e:
            print(f"[{dest['slug']}] Error retrieving {s3_key}: {e}")
            return
        
        # Process each park for the destination
        for park in dest["parks"]:
            print(f"[{dest['slug']}] Fetching data for park: {park['name']}")
            try:
                park_url = f"https://api.themeparks.wiki/v1/entity/{park['id']}/live"
                park_response = requests.get(park_url)
                park_response.raise_for_status()
                park_data = park_response.json()
                
                # Filter liveData for attractions only
                park_data["liveData"] = [
                    attr for attr in park_data.get("liveData", [])
                    if attr.get("entityType") == "ATTRACTION"
                ]
                
                current_attractions = set()
                park_id = park_data.get("id")
                
                # If park does not exist in stored data, add it.
                if park_id not in dest_data["parks"]:
                    dest_data["parks"][park_id] = {
                        "id": park_id,
                        "name": park_data.get("name"),
                        "slug": park_data.get("slug"),
                        "entityType": park_data.get("entityType"),
                        "timezone": park_data.get("timezone"),
                        "liveData": {}
                    }
                    for item in park_data["liveData"]:
                        current_attractions.add(item["id"])
                        dest_data["parks"][park_id]["liveData"][item["id"]] = {
                            "id": item["id"],
                            "name": item.get("name"),
                            "status": item.get("status"),
                            "queue": item.get("queue"),
                            "lastUpdated": item.get("lastUpdated"),
                            "history": [{
                                "time": current_time,
                                "queue": item.get("queue"),
                                "status": item.get("status")
                            }]
                        }
                else:
                    # Update existing park data
                    for item in park_data["liveData"]:
                        current_attractions.add(item["id"])
                        if item["id"] not in dest_data["parks"][park_id]["liveData"]:
                            dest_data["parks"][park_id]["liveData"][item["id"]] = {
                                "id": item["id"],
                                "name": item.get("name"),
                                "status": item.get("status"),
                                "queue": item.get("queue"),
                                "lastUpdated": item.get("lastUpdated"),
                                "history": [{
                                    "time": current_time,
                                    "queue": item.get("queue"),
                                    "status": item.get("status")
                                }]
                            }
                        else:
                            existing_attr = dest_data["parks"][park_id]["liveData"][item["id"]]
                            has_queue_changed = json.dumps(existing_attr.get("queue")) != json.dumps(item.get("queue"))
                            has_status_changed = existing_attr.get("status") != item.get("status")
                            
                            if has_queue_changed or has_status_changed:
                                # Append new history record if data has changed.
                                existing_attr.setdefault("history", []).append({
                                    "time": current_time,
                                    "queue": item.get("queue"),
                                    "status": item.get("status")
                                })
                                # Remove history entries older than 24 hours.
                                cutoff = current_time - (24 * 60 * 60 * 1000)
                                existing_attr["history"] = [
                                    entry for entry in existing_attr["history"]
                                    if entry["time"] >= cutoff
                                ]
                            # Always update the current values.
                            existing_attr["name"] = item.get("name")
                            existing_attr["status"] = item.get("status")
                            existing_attr["queue"] = item.get("queue")
                            existing_attr["lastUpdated"] = item.get("lastUpdated")
                    
                    # Remove attractions no longer present in the API data.
                    to_remove = [
                        attr_id for attr_id in dest_data["parks"][park_id]["liveData"]
                        if attr_id not in current_attractions
                    ]
                    for attr_id in to_remove:
                        del dest_data["parks"][park_id]["liveData"][attr_id]
            except Exception as e:
                print(f"[{dest['slug']}] Error processing park {park['name']} ({park['id']}): {e}")
        
        # Upload the updated data back to S3.
        try:
            s3_client.put_object(
                Bucket=BUCKET_NAME,
                Key=s3_key,
                Body=json.dumps(dest_data),
                ContentType='application/json'
            )
            print(f"[{dest['slug']}] {s3_key} uploaded successfully to S3.")
        except Exception as e:
            print(f"[{dest['slug']}] Error uploading {s3_key} to S3: {e}")
    except Exception as e:
        print(f"[{dest['slug']}] Unexpected error in processing destination {dest['slug']}: {e}")
    finally:
        print(f"[{dest['slug']}] Completed update for {dest['slug']} at {datetime.now().isoformat()}")

def lambda_handler(event, context):
    # List of destination configurations.
    destinations = [
        # {
        #     "id": "e8d0207f-da8a-4048-bec8-117aa946b2c2",
        #     "name": "Disneyland Paris",
        #     "slug": "disneylandparis",
        #     "parks": [
        #         {"id": "ca888437-ebb4-4d50-aed2-d227f7096968", "name": "Walt Disney Studios Park"},
        #         {"id": "dae968d5-630d-4719-8b06-3d107e944401", "name": "Disneyland Park"}
        #     ]
        # },
        # {
        #     "id": "faff60df-c766-4470-8adb-dee78e813f42",
        #     "name": "Tokyo Disney Resort",
        #     "slug": "tokyodisneyresort",
        #     "parks": [
        #         {"id": "67b290d5-3478-4f23-b601-2f8fb71ba803", "name": "Tokyo DisneySea"},
        #         {"id": "3cc919f1-d16d-43e0-8c3f-1dd269bd1a42", "name": "Tokyo Disneyland"}
        #     ]
        # },
        # {
        #     "id": "6e1464ca-1e9b-49c3-8937-c5c6f6675057",
        #     "name": "Shanghai Disney Resort",
        #     "slug": "shanghaidisneyresort",
        #     "parks": [
        #         {"id": "ddc4357c-c148-4b36-9888-07894fe75e83", "name": "Shanghai Disneyland"}
        #     ]
        # },
        # {
        #     "id": "abcfffe7-01f2-4f92-ae61-5093346f5a68",
        #     "name": "Hong Kong Disneyland Parks",
        #     "slug": "hongkongdisneylandpark",
        #     "parks": [
        #         {"id": "bd0eb47b-2f02-4d4d-90fa-cb3a68988e3b", "name": "Hong Kong Disneyland Park"}
        #     ]
        # },
        {
            "id": "bfc89fd6-314d-44b4-b89e-df1a89cf991e",
            "name": "Disneyland Resort",
            "slug": "disneylandresort",
            "parks": [
                {"id": "7340550b-c14d-4def-80bb-acdb51d49a66", "name": "Disneyland Park"},
                {"id": "832fcd51-ea19-4e77-85c7-75d5843b127c", "name": "Disney California Adventure Park"}
            ]
        },
        {
            "id": "9fc68f1c-3f5e-4f09-89f2-aab2cf1a0741",
            "name": "Universal Studios",
            "slug": "universalstudios",
            "parks": [
                {"id": "bc4005c5-8c7e-41d7-b349-cdddf1796427", "name": "Universal Studios"}
            ]
        },
        {
            "id": "89db5d43-c434-4097-b71f-f6869f495a22",
            "name": "Universal Orlando Resort",
            "slug": "universalorlando",
            "parks": [
                {"id": "fe78a026-b91b-470c-b906-9d2266b692da", "name": "Universal's Volcano Bay"},
                {"id": "267615cc-8943-4c2a-ae2c-5da728ca591f", "name": "Universal Islands of Adventure"},
                {"id": "eb3f4560-2383-4a36-9152-6b3e5ed6bc57", "name": "Universal Studios Florida"}
            ]
        },
        # {
        #     "id": "e957da41-3552-4cf6-b636-5babc5cbc4e5",
        #     "name": "Walt Disney World® Resort",
        #     "slug": "waltdisneyworldresort",
        #     "parks": [
        #         {"id": "75ea578a-adc8-4116-a54d-dccb60765ef9", "name": "Magic Kingdom Park"},
        #         {"id": "47f90d2c-e191-4239-a466-5892ef59a88b", "name": "EPCOT"},
        #         {"id": "288747d1-8b4f-4a64-867e-ea7c9b27bad8", "name": "Disney's Hollywood Studios"},
        #         {"id": "1c84a229-8862-4648-9c71-378ddd2c7693", "name": "Disney's Animal Kingdom Theme Park"},
        #         {"id": "b070cbc5-feaa-4b87-a8c1-f94cca037a18", "name": "Disney's Typhoon Lagoon Water Park"},
        #         {"id": "ead53ea5-22e5-4095-9a83-8c29300d7c63", "name": "Disney's Blizzard Beach Water Park"}
        #     ]
        # }
    ]
    
    threads = []
    # Create a thread for each destination.
    for dest in destinations:
        thread = threading.Thread(target=data_update, args=(dest,))
        thread.start()
        threads.append(thread)
    
    # Wait for all threads to complete.
    for thread in threads:
        thread.join()
    
    print("All destination updates completed.")
    return {
        'statusCode': 200,
        'body': json.dumps('Sucessfully updated data!')
    }
