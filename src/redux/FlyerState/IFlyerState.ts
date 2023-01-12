
export interface FlyerAction<T> {
    type: string,
    data: T
  }

export abstract class IFlyerState<T> {
    initState: T

    constructor(value: T) {
        this.initState = value
    }
    /**
     * 返还处理完成的新数据
     * @param state 当前数据
     * @param action 对数据的操作
     */
    protected abstract setReducer(state: T, action: FlyerAction<T>): T

    public addReducer(state: T, action: FlyerAction<T>) {
        return this.setReducer(state?state:this.initState, action)
    }
}


