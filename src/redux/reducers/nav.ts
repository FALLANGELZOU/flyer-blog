interface Action {
    type: string;
    state: {
        path?: string; 
        index?: number;
    }
  }
  
  const initState = {
    path: "",
    index: 0
  };
  
  export default function addReducer(preState = initState, action: Action) {
    const { type, state } = action;
    switch (type) {
      case "update":
        return state;
      default:
        return preState;
    }
  }
  