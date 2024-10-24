import { Park } from './Park'

export class Destination {
  id: string
  name: string
  slug: string
  lastUpdated: number
  parks: Record<string, Park>
  lat: number | null = null
  lon: number | null = null

  constructor (id: string, name: string, slug: string, lastUpdated: number, parks: Record<string, Park>) {
    this.id = id
    this.name = name
    this.slug = slug
    this.lastUpdated = lastUpdated
    this.parks = parks
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

  public addLocationData (lat: number | null, lon: number | null) {
    this.lat = lat
    this.lon = lon
  }
}
