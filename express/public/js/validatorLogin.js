window.onload = function () {
  // Input fields
  const email = document.querySelector("#emailLogin");
  const password = document.querySelector("#passwordLogin");
  const showButton = document.querySelector(".showBtn");

  // Regex email
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  // Forms
  const form = document.querySelector("#login-form");

  // empezamos con el foco en el primer input
  email.focus();

  function showPassword(element) {
    if (element.alt == "hide icon") {
      element.src = "/images/icons/view.png";
      element.alt = "show icon";
    } else {
      element.alt = "hide icon";
      element.src = "/images/icons/hide.png";
    }
    // buscamos el input con OOP
    let field = element.parentElement.previousElementSibling;
    field.type == "password"
      ? (field.type = "text")
      : (field.type = "password");
  }

  showButton.addEventListener("click", function (e) {
    showPassword(e.target);
  });

  // Handle form
  form.addEventListener("submit", function (e) {
    // prevenimos que se envíe
    e.preventDefault();
    // almacenaremos errores
    const errors = [];

    // chequeamos email vacío o formato
    if (email.value == "") {
      document.querySelector(".email-validation").innerText =
        "El campo email no puede estar vacío";
      email.classList.add("is-invalid");
      errors.push("error");
    } else if (!emailRegex.test(email.value)) {
      email.classList.add("is-invalid");
      document.querySelector(".email-validation").innerText =
        "Debe tener formato de email";
      errors.push("error");
    } else {
      email.classList.remove("is-invalid");
      // email.classList.add("is-valid");
      document.querySelector(".email-validation").innerText = "";
    }

    if (password.value == "") {
      document.querySelector(".password-validation").innerText =
        "Por favor, introduzca su contraseña";
      password.classList.add("is-invalid");
      errors.push("error");
    } else {
      password.classList.remove("is-invalid");
      document.querySelector(".password-validation").innerText = "";
    }

    if (errors.length > 0) {
      e.preventDefault();
    } else {
      form.submit();
    }
  });
};
