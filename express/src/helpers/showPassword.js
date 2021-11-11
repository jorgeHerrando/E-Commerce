export const showPassword = function (element) {
  if (element.alt == "hide icon") {
    element.src = "/images/icons/view.png";
    element.alt = "show icon";
  } else {
    element.alt = "hide icon";
    element.src = "/images/icons/hide.png";
  }
  // buscamos el input con OOP
  let field = element.parentElement.previousElementSibling;
  field.type == "password" ? (field.type = "text") : (field.type = "password");
};
