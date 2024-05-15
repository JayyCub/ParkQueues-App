import {Attraction, AttractionInterface} from "./Attraction";

export enum EntityType {
  DESTINATION = "DESTINATION",
  PARK = "PARK",
  ATTRACTION = "ATTRACTION",
  RESTAURANT = "RESTAURANT",
  HOTEL = "HOTEL",
  SHOW = "SHOW"
}

export interface ParkInterface {
  id: string;
  name: string;
  entityType: EntityType;
  timezone: string;
  liveData: { [attractionId: string]: AttractionInterface }; // Changed to object
}

export class Park {
  id: string;
  name: string;
  entityType: EntityType;
  timezone: string;
  liveData: { [attractionId: string]: Attraction }; // Changed to object

  constructor(response: ParkInterface) {
    this.id = response.id;
    this.name = response.name;
    this.entityType = response.entityType;
    this.timezone = response.timezone;
    this.liveData = {}; // Initialize as empty object

    // Iterate over the attraction data and create new Attraction objects
    for (let attractionId in response.liveData) {
      let attractionData = response.liveData[attractionId];
       // Create new Attraction object
      this.liveData[attractionId] = new Attraction(attractionData); // Assign to the attractions object
    }
  }

  public static fromJson(json: string | null | undefined): Park | null {
    if (!!json) {
      let jsonObject: ParkInterface = JSON.parse(json);

      return new Park({
        id: jsonObject.id,
        name: jsonObject.name,
        entityType: jsonObject.entityType,
        timezone: jsonObject.timezone,
        liveData: jsonObject.liveData // Use the provided liveData
      });
    } else {
      return null;
    }
  }
}
