import {EntityType} from "./Park";
import {Queue, QueueInterface, QueueType} from "./Queue";

export enum LiveStatusType {
  OPERATING = "OPERATING",
  DOWN = "DOWN",
  CLOSED = "CLOSED",
  REFURBISHMENT = "REFURBISHMENT"
}

interface LiveShowTime {
  type: string;
  startTime: string;
  endTime: string;
}

interface DiningAvailability {
  partySize: number;
  waitTime: number;
}

export interface HistoryData {
  time: Date;
  status: LiveStatusType;
  queue: Queue;
}

export interface AttractionInterface {
  id: string;
  name: string;
  entityType: EntityType;
  status: LiveStatusType;
  lastUpdated: string;
  queue: QueueInterface;
  showtimes: LiveShowTime[];
  operatingHours: LiveShowTime[];
  diningAvailability: DiningAvailability[];
  history: HistoryData[];
}

export class Attraction implements AttractionInterface {
  id: string;
  name: string;
  entityType: EntityType;
  status: LiveStatusType;
  lastUpdated: string;
  queue: Queue;
  showtimes: LiveShowTime[];
  operatingHours: LiveShowTime[];
  diningAvailability: DiningAvailability[];
  history: HistoryData[] = [];

  constructor(attractionData: AttractionInterface) {
    this.id = attractionData.id;
    this.name = attractionData.name;
    this.entityType = attractionData.entityType;
    this.status = attractionData.status;
    this.lastUpdated = attractionData.lastUpdated;
    this.queue =
      new Queue(this.status === LiveStatusType.OPERATING ? attractionData.queue : {});
    this.showtimes = attractionData.showtimes;
    this.operatingHours = attractionData.operatingHours;
    this.diningAvailability = attractionData.diningAvailability;
    // this.history = attractionData.history;

    attractionData.history.forEach((histItem) => {
      let newQueue = new Queue(histItem.queue);
      if (histItem.status === LiveStatusType.REFURBISHMENT
        || histItem.status === LiveStatusType.DOWN
        || histItem.status === LiveStatusType.CLOSED) {
        newQueue.queueType = QueueType.closed;
      }

      this.history.push({
        time: histItem.time,
        status: histItem.status,
        queue: newQueue,
      });
    });

  }

  // You can add more methods here as needed
}

