import { HISTORY_TRANSACTION_QUEUE_LENGTH } from 'constants/index'

export class FixedSizeQueue<T> {
  private container = new Array<T>()
  readonly maxSize: number
  constructor(size: number) {
    this.maxSize = size
  }

  public static fromArray<T>(arr: T[], size = arr.length): FixedSizeQueue<T> {
    const queue = new FixedSizeQueue<T>(size)
    for (const item of arr) {
      queue.push(item)
    }
    return queue
  }

  public reborn(): FixedSizeQueue<T> {
    const rebornOne = new FixedSizeQueue<T>(HISTORY_TRANSACTION_QUEUE_LENGTH)
    for (const item of this) {
      rebornOne.push(item)
    }
    return rebornOne
  }

  public get(index: number): T {
    return this.container[index]
  }

  public isEmpty(): boolean {
    return !this.container.length
  }

  public push(item: T) {
    if (this.container.length < this.maxSize) {
      this.container.push(item)
    } else {
      this.container.shift()
      this.container.push(item)
    }
  }

  public filter(callback: (e: T, index: number) => boolean) {
    return this.container.filter(callback)
  }

  public find(callback: (e: T) => boolean) {
    return this.container.find(callback)
  }

  public some(callback: (e: T) => boolean) {
    return this.container.some(callback)
  }

  public shift(): T | undefined {
    return this.container.shift()
  }

  [Symbol.iterator]() {
    return this.container[Symbol.iterator]()
  }
}
