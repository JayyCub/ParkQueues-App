import { Attraction, type AttractionInterface } from './Attraction'
import { locationData } from '../LocationData/locationData'

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
  lat?: number
  lon?: number
}

export class Park {
  id: string
  name: string
  entityType: EntityType
  timezone: string
  liveData: Record<string, Attraction>
  lat?: number
  lon?: number

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
      console.log(`ERROR: No data found: ${this.name}`)
    }
  }
}
