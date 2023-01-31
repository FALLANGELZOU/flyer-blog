
export const setHiddenNav = (data: boolean) => ({
    type: "hidden_nav",
    data
})
export const hiddenNav = (
    preState = false, 
    action: {
        type: string,
        data: boolean
    }
) => {
    switch (action.type) {
        case "hidden_nav":
          return action.data;
        default:
          return preState;
      }
}


