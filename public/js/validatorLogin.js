window.onload = function () {
  // Input fields
  const email = document.querySelector("#emailLogin");
  const password = document.querySelector("#passwordLogin");

  // Regex email
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  // Forms
  const form = document.querySelector("#login-form");

  // empezamos con el foco en el primer input
  email.focus();

  // Handle form
  form.addEventListener("submit", function (e) {
    // prevenimos que se envíe
    e.preventDefault();
    // almacenaremos errores
    const errors = [];

    // chequeamos email vacío o formato
    if (email.value == "") {
      if (email)
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
