// Definimos la constante de acción para cambiar la opción del menú
export const CHANGE_MENU = "CHANGE_MENU";

// Action creator que crea la acción para cambiar el menú
export const changeMenuOption = (payload) => {
  return {
    type: CHANGE_MENU, // Tipo de acción que el reducer reconocerá
    payload,           // Valor que queremos establecer en menuOptionsHeader
  };
};
