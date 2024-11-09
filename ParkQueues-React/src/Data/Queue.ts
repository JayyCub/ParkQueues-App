export enum ReturnTimeState {
  AVAILABLE = 'AVAILABLE',
  TEMP_FULL = 'TEMP_FULL',
  FINISHED = 'FINISHED'
}

enum BoardingGroupState {
  AVAILABLE = 'AVAILABLE',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED'
}

interface PriceData {
  amount: number
  currency: string
  formatted: string | undefined
}

export enum QueueType {
  'open_status' = 0,
  'standby' = 1,
  'standby_reservation' = 2,
  'boarding_reservation' = 3,
  'standby_single_reservation' = 4,
  'standby_single' = 5,
  'undetermined' = 6,
  'closed' = 7,
}

export interface QueueInterface {
  STANDBY?: { waitTime: number }
  SINGLE_RIDER?: { waitTime: number }
  RETURN_TIME?: {
    state: ReturnTimeState
    returnStart: string
    returnEnd: string
  }
  PAID_RETURN_TIME?: {
    state: ReturnTimeState
    returnStart: string
    returnEnd: string
    price: PriceData
  }
  BOARDING_GROUP?: {
    allocationStatus: BoardingGroupState
    currentGroupStart?: number | null
    currentGroupEnd?: number | null
    nextAllocationTime?: string | null
    estimatedWait?: number | null
  }
  PAID_STANDBY?: { waitTime: number }
}

export class Queue implements QueueInterface {
  STANDBY?: { waitTime: number }
  SINGLE_RIDER?: { waitTime: number }
  RETURN_TIME?: {
    state: ReturnTimeState
    returnStart: string
    returnEnd: string
  }

  PAID_RETURN_TIME?: {
    state: ReturnTimeState
    returnStart: string
    returnEnd: string
    price: PriceData
  }

  BOARDING_GROUP?: {
    allocationStatus: BoardingGroupState
    currentGroupStart?: number | null
    currentGroupEnd?: number | null
    nextAllocationTime?: string | null
    estimatedWait?: number | null
  }

  PAID_STANDBY?: { waitTime: number }

  queueType: QueueType

  constructor (queue: QueueInterface | undefined) {
    if (queue === undefined) {
      this.STANDBY = undefined
      this.SINGLE_RIDER = undefined
      this.RETURN_TIME = undefined
      this.PAID_RETURN_TIME = undefined
      this.BOARDING_GROUP = undefined
      this.PAID_STANDBY = undefined
      this.queueType = 0
      return
    }

    this.STANDBY = queue.STANDBY
    this.SINGLE_RIDER = queue.SINGLE_RIDER
    this.RETURN_TIME = queue.RETURN_TIME
    this.PAID_RETURN_TIME = queue.PAID_RETURN_TIME
    this.BOARDING_GROUP = queue.BOARDING_GROUP
    this.PAID_STANDBY = queue.PAID_STANDBY

    if (this.STANDBY !== undefined &&
      this.SINGLE_RIDER !== undefined &&
      this.RETURN_TIME === undefined && this.PAID_RETURN_TIME === undefined) {
      this.queueType = 5
    } else if (this.STANDBY !== undefined &&
      this.SINGLE_RIDER !== undefined &&
      (this.RETURN_TIME !== undefined || this.PAID_RETURN_TIME !== undefined)
    ) {
      this.queueType = 4
    } else if (this.STANDBY === undefined &&
      this.BOARDING_GROUP !== undefined &&
      (this.RETURN_TIME !== undefined || this.PAID_RETURN_TIME !== undefined)
    ) {
      this.queueType = 3
    } else if (this.STANDBY !== undefined &&
      (this.RETURN_TIME !== undefined || this.PAID_RETURN_TIME !== undefined)
    ) {
      this.queueType = 2
    } else if (this.STANDBY !== undefined && this.STANDBY?.waitTime !== null
    ) {
      this.queueType = 1
    } else if (this.STANDBY === undefined || (this.STANDBY.waitTime === null)) {
      this.queueType = 0
    } else {
      this.queueType = 6
    }
  }
}
