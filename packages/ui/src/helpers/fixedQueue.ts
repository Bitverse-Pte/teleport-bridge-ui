export class FixedSizeQueue<T> {
  private container = new Array<T>()
  readonly maxSize: number
  constructor(size: number) {
    this.maxSize = size
  }

  public static fromArray<T>(arr: T[]): FixedSizeQueue<T> {
    const queue = new FixedSizeQueue<T>(arr.length)
    for (const item of arr) {
      queue.push(item)
    }
    return queue
  }

  public reborn(): FixedSizeQueue<T> {
    const rebornOne = new FixedSizeQueue<T>(10)
    for (const item of this) {
      rebornOne.push(item)
    }
    return rebornOne
  }

  public get(index: number): T {
    return this.container[index]
  }

  public push(item: T) {
    if (this.container.length < this.maxSize) {
      this.container.push(item)
    } else {
      this.container.shift()
      this.container.push(item)
    }
  }
  public find(callback: (e: T) => boolean) {
    return this.container.find(callback)
  }

  public shift(): T | undefined {
    return this.container.shift()
  }

  [Symbol.iterator]() {
    return this.container[Symbol.iterator]
  }
}
