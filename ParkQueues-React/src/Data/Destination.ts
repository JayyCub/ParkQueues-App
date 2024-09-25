import { Park } from './Park'
import { locationData } from '../LocationData/locationData' // Import the JSON as an object

export class Destination {
  id: string
  name: string
  slug: string
  lastUpdated: number
  parks: Record<string, Park>
  lat?: number // Optional property for latitude
  lon?: number // Optional property for longitude

  constructor (id: string, name: string, slug: string, lastUpdated: number, parks: Record<string, Park>) {
    this.id = id
    this.name = name
    this.slug = slug
    this.lastUpdated = lastUpdated
    this.parks = parks

    // Load lat/lon from the imported data
    this.loadLocationData()
  }

  private loadLocationData (): void {
    const destinationData = locationData[`${this.id}`]

    if (destinationData) {
      // Save lat and lon if they exist
      this.lat = destinationData.lat
      this.lon = destinationData.lon
      console.log(`Latitude and Longitude for ${this.name}: ${this.lat}, ${this.lon}`)
    } else {
      console.log(`ERROR: No data found: ${this.slug}`)
    }
  }

  public static fromJson (json: string | null | undefined): Destination | null {
    if (json != null) {
      const jsonObject: {
        id: string
        name: string
        slug: string
        lastUpdated: number
        parks: Record<string, any>
      } = JSON.parse(json)

      const parks: Record<string, Park> = {}

      for (const parkId in jsonObject.parks) {
        const parkData: Park = jsonObject.parks[parkId]
        parks[parkId] = new Park(parkData)
      }

      return new Destination(
        jsonObject.id,
        jsonObject.name,
        jsonObject.slug,
        jsonObject.lastUpdated,
        parks
      )
    } else {
      return null
    }
  }

  public toJson (): string {
    return JSON.stringify(this)
  }
}
