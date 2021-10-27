window.onload = function () {
  // Input fields
  const firstName = document.querySelector("#firstName");
  const lastName = document.querySelector("#lastName");
  const email = document.querySelector("#email-register");
  const password = document.querySelector("#password");
  const showButton = document.querySelector(".showBtn");
  const showButton2 = document.querySelector(".showBtn2");
  const password2 = document.querySelector("#password2");
  const image = document.querySelector("#image");

  // Regex and image extension
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif"];

  // Forms
  const form = document.querySelector("#register-form");

  // // Handle form
  form.addEventListener("submit", function (e) {
    console.log(validateLastName());
    e.preventDefault();
    if (
      validateFirstName() &&
      validateLastName() &&
      validateEmail() &&
      validatePassword() &&
      validatePassword2()
    ) {
      form.submit();
    }
  });

  // empezamos con el foco en el primer input y le ponemos la clase focus
  firstName.focus();
  firstName.classList.add("focus");

  // VALIDACIONES REGISTER
  // validacion firstName
  function validateFirstName() {
    firstName.classList.remove("on-focus");
    // is Empty?
    if (checkIfEmpty(firstName)) {
      return;
    }
    // length?
    if (!hasLength(firstName, 2, 20)) {
      return;
    }
    document.querySelector(".firstName-validation").innerText = "";
    lastName.focus();
    return true;
  }

  // validacion lastName
  function validateLastName() {
    lastName.classList.remove("on-focus");
    // is Empty?
    if (checkIfEmpty(lastName)) {
      return;
    }
    // length?
    if (!hasLength(lastName, 2, 20)) {
      return;
    }
    document.querySelector(".lastName-validation").innerText = "";
    email.focus();
    return true;
  }

  // validacion email
  function validateEmail() {
    email.classList.remove("on-focus");
    // is Empty?
    if (checkIfEmpty(email)) {
      return;
    }
    // is correct Email?
    if (!emailRegex.test(email.value)) {
      setInvalid(email, `El campo debe tener formato de email`);
      return;
    }
    // setValid(email);
    document.querySelector(".email-validation").innerText = "";
    password.focus();
    return true;
  }

  // validacion password
  function validatePassword() {
    password.classList.remove("on-focus");
    // is Empty?
    if (checkIfEmpty(password)) {
      document.querySelector(".password-validation").innerText =
        "El campo contraseña no puede estar vacío";
      return;
    }
    // is StrongPassword?
    if (!passwordRegex.test(password.value)) {
      setInvalid(
        password,
        `El campo contraseña debe tener al menos 8 caracteres, con una letra mayúscula, una minúscula, un número y un caracter especial`
      );
      return;
    }
    // si hay algo escrito en password2, coincide?
    if (password2.value !== "") {
      if (password.value !== password2.value) {
        setInvalid(password2, `Las contraseñas deben coincidir`);
        return;
      }
    }
    // setValid(password);
    document.querySelector(".password-validation").innerText = "";
    password2.focus();
    return true;
  }

  // validacion password2
  function validatePassword2() {
    password2.classList.remove("on-focus");
    // is password ok?
    if (password.className !== "is-valid") {
      setInvalid(password2, `La contraseña debe ser válida`);
      return;
    }
    // do they match?
    if (password.value !== password2.value) {
      setInvalid(password2, `Las contraseñas deben coincidir`);
      return;
    }
    setValid(password2);
    document.querySelector(".password2-validation").innerText = "";
    return true;
  }

  // validacion imagen
  function validateImage() {
    image.classList.remove("on-focus");
    // is file extension ok?
    if (image.value != "") {
      // recogemos la extension
      const extension = image.value
        .substring(image.value.lastIndexOf("."))
        .toLowerCase();

      // miramos si esta en nuestro array de extensiones permitidas
      if (validExtensions.includes(extension)) {
        document.querySelector(".image-validation").innerText = "";
        setValid(image);
        return true;
      } else {
        image.classList.remove("is-valid");
        image.classList.add("is-invalid");
        document.querySelector(
          ".image-validation"
        ).innerText = `Las extensiones de archivo permitidas son ${validExtensions.join(
          ", "
        )}`;
        image.value = "";
        return false;
      }
    }
  }

  // FUNCIONES AUXILIARES
  function checkIfEmpty(field) {
    if (isEmpty(field.value.trim())) {
      // set field invalid
      setInvalid(field, `El campo no puede estar vacío`);
      return true;
    } else {
      // set field to valid
      setValid(field);
      return false;
    }
  }

  function isEmpty(value) {
    if (value == "") {
      return true;
    } else {
      return false;
    }
  }

  function setInvalid(field, message) {
    document.querySelector(`.${field.name}-validation`).innerText = message;
    field.classList.remove("is-valid");
    field.classList.add("is-invalid");
  }

  function setValid(field) {
    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
  }

  function hasLength(field, min, max) {
    if (field.value.length < min || field.value.length > max) {
      setInvalid(field, `El campo debe tener entre ${min} y ${max} caracteres`);
      return false;
    } else {
      setValid(field);
      return true;
    }
  }

  function elementOnFocus(field) {
    field.classList.remove("is-invalid");
    field.classList.remove("is-valid");
    field.classList.add("on-focus");
  }

  function showPassword(element) {
    if (element.alt == "hide icon") {
      element.src = "/images/icons/view.png";
      element.alt = "show icon";
    } else {
      element.alt = "hide icon";
      element.src = "/images/icons/hide.png";
    }
    field = element.parentElement.previousElementSibling;
    field.type == "password"
      ? (field.type = "text")
      : (field.type = "password");
  }

  // al hacer focus y al irse se validan los fields
  firstName.addEventListener("focus", function () {
    elementOnFocus(firstName);
  });
  firstName.addEventListener("blur", function () {
    validateFirstName();
  });

  lastName.addEventListener("focus", function () {
    elementOnFocus(lastName);
  });
  lastName.addEventListener("blur", function () {
    validateLastName();
  });

  email.addEventListener("focus", function () {
    elementOnFocus(email);
  });
  email.addEventListener("blur", function () {
    validateEmail();
  });

  password.addEventListener("focus", function () {
    elementOnFocus(password);
  });
  password.addEventListener("blur", function () {
    validatePassword();
  });
  // se le da la opción de ver el password escrito
  showButton.addEventListener("click", function (e) {
    showPassword(e.target);
  });

  password2.addEventListener("focus", function () {
    elementOnFocus(password2);
  });
  password2.addEventListener("blur", function () {
    validatePassword2();
  });
  // se le da la opción de ver el password escrito
  showButton2.addEventListener("click", function (e) {
    showPassword(e.target);
  });

  image.addEventListener("change", function () {
    validateImage();
  });
};
