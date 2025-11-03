export const CHANGE_MENU = "CHANGE_MENU";

export const changeMenuOption = (payload) => {
  return {
    type: CHANGE_MENU,
    payload,
  };
};
