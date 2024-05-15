import {Park} from "./Park";

export class Destination {
  id: string;
  name: string;
  slug: string;
  lastUpdated: number;
  parks: { [parkId: string]: Park }; // Changed to object

  constructor(id: string, name: string, slug: string, lastUpdated: number, parks: { [parkId: string]: Park }) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.lastUpdated = lastUpdated;
    this.parks = parks;
  }

  public static fromJson(json: string | null | undefined): Destination | null {
    if (!!json) {
      let jsonObject: {
        id: string;
        name: string;
        slug: string;
        lastUpdated: number;
        parks: {
          [parkId: string]: any; // Change the structure of parks to any
        };
      } = JSON.parse(json);

      let parks: { [parkId: string]: Park } = {};

      // Iterate over the park data and create new Park objects
      for (let parkId in jsonObject.parks) {
        let parkData = jsonObject.parks[parkId];
         // Create new Park object
        parks[parkId] = new Park(parkData); // Assign to the parks object
      }

      return new Destination(
        jsonObject.id,
        jsonObject.name,
        jsonObject.slug,
        jsonObject.lastUpdated,
        parks // Use the new parks object
      );
    } else {
      return null;
    }
  }

  public toJson(): string {
    return JSON.stringify(this);
  }
}
