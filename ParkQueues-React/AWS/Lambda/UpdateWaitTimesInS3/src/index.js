const axios = require('axios');
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

const bucketName = "wait-times-data";
const client = new S3Client();

exports.disneylandparis = async () => {
  // Get file from S3 for the given destination.
  let dest = {
    "id": "e8d0207f-da8a-4048-bec8-117aa946b2c2",
    "name": "Disneyland Paris",
    "slug": "disneylandparis",
    "parks": [
      {
        "id": "ca888437-ebb4-4d50-aed2-d227f7096968",
        "name": "Walt Disney Studios Park"
      },
      {
        "id": "dae968d5-630d-4719-8b06-3d107e944401",
        "name": "Disneyland Park"
      }
    ]
  };
  
  await dataUpdate(dest);
};

exports.tokyodisneyresort = async () => {
  // Get file from S3 for the given destination.
  let dest = {
    "id": "faff60df-c766-4470-8adb-dee78e813f42",
    "name": "Tokyo Disney Resort",
    "slug": "tokyodisneyresort",
    "parks": [
      {
        "id": "67b290d5-3478-4f23-b601-2f8fb71ba803",
        "name": "Tokyo DisneySea"
      },
      {
        "id": "3cc919f1-d16d-43e0-8c3f-1dd269bd1a42",
        "name": "Tokyo Disneyland"
      }
    ]
  };
  
  await dataUpdate(dest);
};

exports.shanghaidisneyresort = async () => {
  // Get file from S3 for the given destination.
  let dest = {
    "id": "6e1464ca-1e9b-49c3-8937-c5c6f6675057",
    "name": "Shanghai Disney Resort",
    "slug": "shanghaidisneyresort",
    "parks": [
      {
        "id": "ddc4357c-c148-4b36-9888-07894fe75e83",
        "name": "Shanghai Disneyland"
      }
    ]
  };
  
  await dataUpdate(dest);
};

exports.hongkongdisneylandpark = async () => {
  // Get file from S3 for the given destination.
  let dest = {
    "id": "abcfffe7-01f2-4f92-ae61-5093346f5a68",
    "name": "Hong Kong Disneyland Parks",
    "slug": "hongkongdisneylandpark",
    "parks": [
      {
        "id": "bd0eb47b-2f02-4d4d-90fa-cb3a68988e3b",
        "name": "Hong Kong Disneyland Park"
      }
    ]
  };
  
  await dataUpdate(dest);
};

exports.disneylandresort = async () => {
  // Get file from S3 for the given destination.
  let dest = {
    "id": "bfc89fd6-314d-44b4-b89e-df1a89cf991e",
    "name": "Disneyland Resort",
    "slug": "disneylandresort",
    "parks": [
      {
        "id": "7340550b-c14d-4def-80bb-acdb51d49a66",
        "name": "Disneyland Park"
      },
      {
        "id": "832fcd51-ea19-4e77-85c7-75d5843b127c",
        "name": "Disney California Adventure Park"
      }
    ]
  };
  
  await dataUpdate(dest);
};

exports.universal_studios = async () => {
  // Get file from S3 for the given destination.
  let dest = {
    id: "9fc68f1c-3f5e-4f09-89f2-aab2cf1a0741",
    name: "Universal Studios",
    slug: "universalstudios",
    parks: [
      {
        id: "bc4005c5-8c7e-41d7-b349-cdddf1796427",
        name: "Universal Studios"
      }
    ]
  };
  
  await dataUpdate(dest);
};

exports.universalorlando = async () => {
  // Get file from S3 for the given destination.
  let dest = {
    id: "89db5d43-c434-4097-b71f-f6869f495a22",
    name: "Universal Orlando Resort",
    slug: "universalorlando",
    parks: [
      {
        id: "fe78a026-b91b-470c-b906-9d2266b692da",
        name: "Universal's Volcano Bay"
      },
      {
        id: "267615cc-8943-4c2a-ae2c-5da728ca591f",
        name: "Universal Islands of Adventure"
      },
      {
        id: "eb3f4560-2383-4a36-9152-6b3e5ed6bc57",
        name: "Universal Studios Florida"
      }
    ]
  };
  
  await dataUpdate(dest);
};

exports.waltdisneyworldresort = async () => {
  // Get file from S3 for the given destination.
  let dest = {
    id: "e957da41-3552-4cf6-b636-5babc5cbc4e5",
    name: "Walt Disney World® Resort",
    slug: "waltdisneyworldresort",
    parks: [
      {
        id: "75ea578a-adc8-4116-a54d-dccb60765ef9",
        name: "Magic Kingdom Park"
      },
      {
        id: "47f90d2c-e191-4239-a466-5892ef59a88b",
        name: "EPCOT"
      },
      {
        id: "288747d1-8b4f-4a64-867e-ea7c9b27bad8",
        name: "Disney's Hollywood Studios"
      },
      {
        id: "1c84a229-8862-4648-9c71-378ddd2c7693",
        name: "Disney's Animal Kingdom Theme Park"
      },
      {
        id: "b070cbc5-feaa-4b87-a8c1-f94cca037a18",
        name: "Disney's Typhoon Lagoon Water Park"
      },
      {
        id: "ead53ea5-22e5-4095-9a83-8c29300d7c63",
        name: "Disney's Blizzard Beach Water Park"
      }
    ]
  };
  
  await dataUpdate(dest);
};

async function dataUpdate(dest) {
  console.log("Getting " + dest.slug + " data...");
  const time = new Date().getTime();
  
  let destData = {
    id: dest.id,
    name: dest.name,
    slug: dest.slug,
    lastUpdated: time,
    parks: {},
  };
  
  const input = {
    "Bucket": bucketName,
    "Key": dest.slug + '.json',
  };
  
  try {
    const response = await client.send(new GetObjectCommand(input));
    
    // SET destData TO RESPONSE DATA
    console.log(`Successfully retrieved ${input.Key}`)
    destData = JSON.parse(await response.Body.transformToString());
    destData.lastUpdated = time;
    
  } catch (e) {
    if (e.Code !== "NoSuchKey") {
      console.log("Error: ", e.Code);
      throw new Error("Error getting S3 data: " + e);
    }
  }
  
  // Compare existing info with API data,
  
  // FOR EACH PARK IN API
  for (const park of dest.parks) {
    console.log("Getting " + park.name);
    await axios
      .get(`https://api.themeparks.wiki/v1/entity/${park.id}/live`)
      .then(async (response) => {
        let parkData = response.data;
        parkData.liveData = parkData.liveData.filter((attr) => {
          return attr.entityType === "ATTRACTION";
        });
        
        // Compare existing info with API data
        // if park exists in S3 destData, leave it. Otherwise, add the park data
        if (!destData.parks.hasOwnProperty(parkData.id)){
          destData.parks[parkData.id] = {
            id: parkData.id,
            name: parkData.name,
            slug: parkData.slug,
            entityType: parkData.entityType,
            timezone: parkData.timezone,
            liveData: {},
          }
          
          // FOR EACH ATTRACTION IN API
          for (let item of parkData.liveData) {
            item = {
              id: item.id,
              name: item.name,
              status: item.status,
              queue: item.queue,
              lastUpdated: item.lastUpdated
            }
            destData.parks[parkData.id].liveData[item.id] = item;
            destData.parks[parkData.id].liveData[item.id].history = [{
              time: time,
              queue: item.queue,
              status: item.status,
            }];
          }
        } else {
          // FOR EACH ATTRACTION IN API
          for (const item of parkData.liveData) {
            // Compare existing info with
            destData.parks[parkData.id].liveData[item.id].name = item.name;
            destData.parks[parkData.id].liveData[item.id].status = item.status;
            destData.parks[parkData.id].liveData[item.id].queue = item.queue;
            destData.parks[parkData.id].liveData[item.id].lastUpdated = item.lastUpdated;
            destData.parks[parkData.id].liveData[item.id].history.push({
              time: time,
              queue: item.queue,
              status: item.status,
            });
            
            // If history contains more than 6 hours worth of history entries, remove old entries
            let len = destData.parks[parkData.id].liveData[item.id].history.length;
            if (len > 72) {
              destData.parks[parkData.id].liveData[item.id].history =
                destData.parks[parkData.id].liveData[item.id].history.slice(len - 72, len);
            }
          }
        }
      });
  }
  // Dest updated, now return data back to S3
  const params = {
    Bucket: bucketName,
    Key: destData.slug + '.json',
    Body: JSON.stringify(destData),
    ContentType: 'application/json'
  };
  try {
    await client.send(new PutObjectCommand(params));
    console.log(`${params.Key} uploaded successfully.`);
  } catch (error) {
    console.error(`Error uploading ${params.Key}:`, error);
    throw error;
  }
}
