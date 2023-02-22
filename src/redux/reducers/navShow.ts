import { SET_NAV_SHOW } from '../constant';

interface Action {
  type: string;
  data: boolean;
}

const initState = false;

export default function addReducer(preState = initState, action: Action) {
  const { type, data } = action;
  switch (type) {
    case SET_NAV_SHOW:
      return data;
    default:
      return preState;
  }
}
