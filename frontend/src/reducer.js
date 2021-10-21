export const initialState = {
  token: sessionStorage.getItem("token") || null,
  user: sessionStorage.getItem("user") || {
    role: null,
    _id: null,
    managedBy: null,
  },
  cart: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_TOKEN":
      return {
        ...state,
        token: action.token,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };
    case "SET_CART":
      return {
        ...state,
        cart: action.cart,
      };
    default:
      return state;
  }
}

export default reducer;
