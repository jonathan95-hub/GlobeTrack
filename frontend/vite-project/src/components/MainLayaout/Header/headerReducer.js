import {CHANGE_MENU} from "../Header/headerAction"

const initialState ={
    menuOptionsHeader: 0,
}

const menuReducerHeader = (state = initialState, action) => {
  if (action.type === CHANGE_MENU) {
    return {
      ...state,
      menuOptionsHeader: action.payload,
    };
  } else {
    return state;
  }
};

export default menuReducerHeader;