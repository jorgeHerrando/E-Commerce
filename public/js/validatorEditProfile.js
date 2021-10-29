window.onload = function () {
  // Input fields
  const firstName = document.querySelector("#firstName-editP");
  const lastName = document.querySelector("#lastName-editP");
  const image = document.querySelector("#image-editP");
  const streetName = document.querySelector("#streetName");
  const number = document.querySelector("#number");
  const apartment = document.querySelector("#apartment");
  const province = document.querySelector("#province");
  const city = document.querySelector("#city");
  const postalCode = document.querySelector("#postalCode");
  const country = document.querySelector("#country");

  // Image extension
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif"];

  // Forms
  const form = document.querySelector("#editProfile-form");

  // // Handle form
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (
      validateFirstName() &&
      validateLastName() &&
      validateNumber()
      //   validatePassword() &&
      //   validatePassword2()
    ) {
      form.submit();
    }
  });

  // empezamos con el foco en el primer input y le ponemos la clase focus
  firstName.focus();
  firstName.classList.add("on-focus");

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
    setValid(firstName);
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
    setValid(lastName);
    image.focus();
    return true;
  }

  //   // validacion password
  //   function validatePassword() {
  //     password.classList.remove("on-focus");
  //     // is Empty?
  //     if (checkIfEmpty(password)) {
  //       document.querySelector(".password-validation").innerText =
  //         "El campo contraseña no puede estar vacío";
  //       return;
  //     }
  //     // is StrongPassword?
  //     if (!passwordRegex.test(password.value)) {
  //       setInvalid(
  //         password,
  //         `El campo contraseña debe tener al menos 8 caracteres, con una letra mayúscula, una minúscula, un número y un caracter especial`
  //       );
  //       return;
  //     }
  //     // si hay algo escrito en password2, coincide?
  //     if (password2.value !== "") {
  //       if (password.value !== password2.value) {
  //         setInvalid(password2, `Las contraseñas deben coincidir`);
  //         return;
  //       }
  //     }
  //     setValid(password);
  //     password2.focus();
  //     return true;
  //   }

  //   // validacion password2
  //   function validatePassword2() {
  //     password2.classList.remove("on-focus");
  //     // is password ok?
  //     if (password.className !== "is-valid") {
  //       setInvalid(password2, `La contraseña debe ser válida`);
  //       return;
  //     }
  //     // do they match?
  //     if (password.value !== password2.value) {
  //       setInvalid(password2, `Las contraseñas deben coincidir`);
  //       return;
  //     }
  //     setValid(password2);
  //     return true;
  //   }

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
        image.classList.remove("is-invalid");
        image.classList.add("is-valid");
        // setValid(image);
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

  // validacion number
  function validateNumber() {
    number.classList.remove("on-focus");
    // is Empty?
    if (number.value != "") {
      // is a number? Lo que convierte da como resultado un NaN?
      if (Number.isNaN(Number(number.value))) {
        setInvalid(number, `Debes introducir un número`);
      } else {
        setValid(number);
        apartment.focus();
        return true;
      }
    }
  }

  // validacion country
  function validateCountry() {
    // hay que hacer node-fetch en controller
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
    document.querySelector(`.${field.name}-validation`).innerText = "";
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

  //   function showPassword(element) {
  //     if (element.alt == "hide icon") {
  //       element.src = "/images/icons/view.png";
  //       element.alt = "show icon";
  //     } else {
  //       element.alt = "hide icon";
  //       element.src = "/images/icons/hide.png";
  //     }
  //     field = element.parentElement.previousElementSibling;
  //     field.type == "password"
  //       ? (field.type = "text")
  //       : (field.type = "password");
  //   }

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

  country.addEventListener("focus", function () {
    elementOnFocus(country);
  });
  country.addEventListener("blur", function () {
    validatePassword();
  });

  image.addEventListener("change", function () {
    validateImage();
  });
};
