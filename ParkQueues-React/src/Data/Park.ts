import { Attraction, type AttractionInterface } from './Attraction'

export enum EntityType {
  DESTINATION = 'DESTINATION',
  PARK = 'PARK',
  ATTRACTION = 'ATTRACTION',
  RESTAURANT = 'RESTAURANT',
  HOTEL = 'HOTEL',
  SHOW = 'SHOW'
}

export interface ParkInterface {
  id: string
  name: string
  entityType: EntityType
  timezone: string
  liveData: Record<string, AttractionInterface>
  lat: number | null
  lon: number | null
}

export class Park {
  id: string
  name: string
  entityType: EntityType
  timezone: string
  liveData: Record<string, Attraction>
  lat: number | null = null
  lon: number | null = null

  constructor (response: ParkInterface) {
    this.id = response.id
    this.name = response.name
    this.entityType = response.entityType
    this.timezone = response.timezone
    this.liveData = {}

    for (const attractionId in response.liveData) {
      const attractionData = response.liveData[attractionId]
      // Create new Attraction object
      this.liveData[attractionId] = new Attraction(attractionData)
    }
  }

  public addLocationData (lat: number | null, lon: number | null) {
    // Calculate average from attractions if they have coordinates
    let validCoordinates = Object.values(this.liveData)
      .filter(attraction => attraction.lat !== null && attraction.lon !== null)
      
    if (validCoordinates.length > 0) {
      // Calculate average lat/lon from attractions
      this.lat = validCoordinates.reduce((sum, attr) => sum + (attr.lat ?? 0), 0) / validCoordinates.length
      this.lon = validCoordinates.reduce((sum, attr) => sum + (attr.lon ?? 0), 0) / validCoordinates.length
    } else {
      // If no attractions have coordinates, use the provided lat/lon
      this.lat = lat
      this.lon = lon
    }
  }
}
