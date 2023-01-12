import { FlyerAction, IFlyerState } from "./IFlyerState";

interface State {
    path?: string,
    index?: number
}

export const NavStateType = {
    UPDATE: "update"
}

class NavState extends IFlyerState<State> {
    protected setReducer(state: State = this.initState, action: FlyerAction<State>): State {
        
        switch(action.type) {
            case NavStateType.UPDATE:
                return action.data
            default:
                return state
        }
    }

}

export default new NavState({path: "/", index: 0})