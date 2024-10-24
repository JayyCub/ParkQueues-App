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
    this.lat = lat
    this.lon = lon
  }
}
