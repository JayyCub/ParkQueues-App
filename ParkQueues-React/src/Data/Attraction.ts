import { type EntityType } from './Park'
import { Queue, type QueueInterface, QueueType } from './Queue'

export enum LiveStatusType {
  OPERATING = 'OPERATING',
  DOWN = 'DOWN',
  CLOSED = 'CLOSED',
  REFURBISHMENT = 'REFURBISHMENT'
}

interface LiveShowTime {
  type: string
  startTime: string
  endTime: string
}

interface DiningAvailability {
  partySize: number
  waitTime: number
}

export interface HistoryData {
  time: Date
  status: LiveStatusType
  queue: Queue
}

export interface AttractionInterface {
  id: string
  name: string
  entityType: EntityType
  status: LiveStatusType
  lastUpdated: string
  queue: QueueInterface
  showtimes: LiveShowTime[]
  operatingHours: LiveShowTime[]
  diningAvailability: DiningAvailability[]
  history: HistoryData[]
  lat: number | null
  lon: number | null
}

export class Attraction implements AttractionInterface {
  id: string
  name: string
  entityType: EntityType
  status: LiveStatusType
  lastUpdated: string
  queue: Queue
  showtimes: LiveShowTime[]
  operatingHours: LiveShowTime[]
  diningAvailability: DiningAvailability[]
  history: HistoryData[] = []
  lat: number | null = null
  lon: number | null = null

  constructor (attractionData: AttractionInterface) {
    this.id = attractionData.id
    this.name = attractionData.name
    this.entityType = attractionData.entityType
    this.status = attractionData.status
    this.lastUpdated = attractionData.lastUpdated
    this.queue = new Queue(attractionData.queue, this.status)
    this.showtimes = attractionData.showtimes
    this.operatingHours = attractionData.operatingHours
    this.diningAvailability = attractionData.diningAvailability

    // Initialize empty history array
    this.history = []

    const interval = 5 * 60 * 1000 // 5 minutes in milliseconds

    if (attractionData.history.length === 0) {
      // Add two data points if history is empty
      const currentTime = Math.round(Date.now() / interval) * interval
      const yesterdayTime = currentTime - (24 * 60 * 60 * 1000) // 24 hours ago
      const yesterdayRounded = Math.round(yesterdayTime / interval) * interval

      // Add data point from 24 hours ago
      attractionData.history.push({
        time: new Date(yesterdayRounded),
        status: this.status,
        queue: this.queue
      })

      // Add current data point
      attractionData.history.push({
        time: new Date(currentTime),
        status: this.status,
        queue: this.queue
      })
    } else {
      // Sort history to find oldest entry
      const sortedHistory = [...attractionData.history].sort((a, b) =>
        new Date(a.time).getTime() - new Date(b.time).getTime()
      )

      const oldestTime = new Date(sortedHistory[0].time).getTime()
      const currentTime = Date.now()
      const twentyFourHoursAgo = currentTime - (24 * 60 * 60 * 1000)

      // If oldest data point is newer than 24 hours ago
      if (oldestTime > twentyFourHoursAgo) {
        const yesterdayRounded = Math.round(twentyFourHoursAgo / interval) * interval

        // Add data point from 24 hours ago using oldest known data
        attractionData.history.unshift({
          time: new Date(yesterdayRounded),
          status: sortedHistory[0].status,
          queue: sortedHistory[0].queue
        })
      }
    }

    // console.log(attractionData.name, attractionData.history.length)
    if (attractionData.history.length > 0) {
      const sortedHistory = [...attractionData.history].sort((a, b) =>
        new Date(a.time).getTime() - new Date(b.time).getTime()
      )

      const BUFFER = 30 * 1000 // 30 seconds in milliseconds

      // Round start and end times to nearest 5-minute interval
      const startTime = Math.round(new Date(sortedHistory[0].time).getTime() / interval) * interval
      const endTime = Math.round(new Date(sortedHistory[sortedHistory.length - 1].time).getTime() / interval) * interval

      // Create map with rounded timestamps
      const historyMap = new Map(
        sortedHistory.map(item => {
          const timestamp = new Date(item.time).getTime()
          const roundedTime = Math.round(timestamp / interval) * interval
          return [roundedTime, item]
        })
      )

      // Generate timestamps every 5 minutes using rounded times
      let lastKnownData = sortedHistory[0] // Keep track of last known data point

      for (let timestamp = startTime; timestamp <= endTime; timestamp += interval) {
        if (
          historyMap.has(timestamp) ||
          historyMap.has(timestamp - BUFFER) ||
          historyMap.has(timestamp + BUFFER)
        ) {
          // If we have real data within the buffer window, use it
          const actualTimestamp = historyMap.has(timestamp)
            ? timestamp
            : historyMap.has(timestamp - BUFFER)
              ? timestamp - BUFFER
              : timestamp + BUFFER
          const item = historyMap.get(actualTimestamp)!
          lastKnownData = item // Update last known data
          this.history.push({
            time: new Date(timestamp),
            status: item.status,
            queue: new Queue(item.queue, item.status)
          })
        } else {
          // Use the last known data point
          this.history.push({
            time: new Date(timestamp),
            status: lastKnownData.status,
            queue: new Queue(lastKnownData.queue, lastKnownData.status)
          })
        }
      }

      // Fill gaps from the last history entry to the current time
      const currentTime = Math.round(Date.now() / interval) * interval // Current time rounded to nearest interval
      const lastHistoryTime = Math.round(new Date(this.history[this.history.length - 1].time).getTime() / interval) * interval

      if (lastHistoryTime < currentTime - (1000 * 60 * 5)) {
        for (let timestamp = lastHistoryTime + interval; timestamp <= currentTime; timestamp += interval) {
          this.history.push({
            time: new Date(timestamp),
            status: lastKnownData.status,
            queue: new Queue(lastKnownData.queue, lastKnownData.status)
          })
        }
      }
    }

    if (this.queue.queueType === QueueType.boarding_reservation &&
      (this.queue.BOARDING_GROUP?.currentGroupStart === null &&
       this.queue.BOARDING_GROUP?.currentGroupEnd === null)) {
      this.status = LiveStatusType.DOWN
    }
  }

  private interpolateData (
    prevData: HistoryData,
    nextData: HistoryData,
    currentTime: number,
    prevTime: number,
    nextTime: number
  ): HistoryData {
    // For status, use the previous status (no interpolation for enum values)
    const status = prevData.status

    // Interpolate queue data
    const queue = { ...prevData.queue }

    // Linear interpolation for wait times
    if (queue.STANDBY?.waitTime !== undefined &&
        nextData.queue.STANDBY?.waitTime !== undefined) {
      const prevWait = queue.STANDBY.waitTime
      const nextWait = nextData.queue.STANDBY.waitTime
      const ratio = (currentTime - prevTime) / (nextTime - prevTime)
      queue.STANDBY.waitTime = Math.round(
        prevWait + (nextWait - prevWait) * ratio
      )
    }

    // Do the same for SINGLE_RIDER if it exists
    if (queue.SINGLE_RIDER?.waitTime !== undefined &&
        nextData.queue.SINGLE_RIDER?.waitTime !== undefined) {
      const prevWait = queue.SINGLE_RIDER.waitTime
      const nextWait = nextData.queue.SINGLE_RIDER.waitTime
      const ratio = (currentTime - prevTime) / (nextTime - prevTime)
      queue.SINGLE_RIDER.waitTime = Math.round(
        prevWait + (nextWait - prevWait) * ratio
      )
    }

    return {
      time: new Date(currentTime),
      status,
      queue
    }
  }

  public addLocationData (lat: number | null, lon: number | null) {
    this.lat = lat
    this.lon = lon
  }
}
