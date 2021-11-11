window.onload = function () {
  // Input fields
  const name = document.querySelector("#name");
  const description = document.querySelector("#description");
  const image = document.querySelector("#image");
  const category = document.querySelector("#category");
  const subcategory = document.querySelector("#subcategory");
  const brand = document.querySelector("#brand");
  const price = document.querySelector("#price");
  const discount = document.querySelector("#discount");
  const sale = document.querySelector("#sale");
  const size = document.querySelector("#size");
  const stock = document.querySelector("#stock");
  // const tag = document.querySelector("#tag");

  // Image extension
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif"];

  // Forms
  const form = document.querySelector("#createProduct-form");

  // // Handle form
  form.addEventListener("submit", function (e) {
    //   se previene que lo suba de momento
    e.preventDefault();
    // si pasa todas las validaciones
    if (
      validateName() &&
      validateDescription() &&
      validateImageEmpty() !== false &&
      validateCategory() &&
      validateBrand() &&
      validatePrice() &&
      validateDiscount() &&
      validateSale() &&
      validateSize() &&
      validateStock()
    ) {
      // se manda
      form.submit();
    }
  });

  // empezamos con el foco en el primer input y le ponemos la clase focus
  name.focus();
  name.classList.add("on-focus");

  // VALIDACIONES CREATE PRODUCT
  // validacion name
  function validateName() {
    name.classList.remove("on-focus");
    // is Empty?
    if (checkIfEmpty(name)) {
      return;
    }
    // length?
    if (!hasLength(name, 5, 50)) {
      return;
    }
    setValid(name);
    description.focus();
    return true;
  }

  // validacion description
  function validateDescription() {
    description.classList.remove("on-focus");
    // is Empty?
    if (checkIfEmpty(description)) {
      return;
    }
    // length?
    if (!hasLength(description, 20, 500)) {
      return;
    }
    setValid(description);
    image.focus();
    return true;
  }

  // validacion imagen
  function validateImage() {
    image.classList.remove("on-focus");
    // are files extensions ok?
    if (image.value != "") {
      for (let i = 0; i < image.files.length; i++) {
        // recogemos la extension
        const extension = image.files[i].name
          .substring(image.files[i].name.lastIndexOf("."))
          .toLowerCase();

        // miramos si esta en nuestro array de extensiones permitidas
        if (validExtensions.includes(extension)) {
          setValid(image);
        } else {
          setInvalid(
            image,
            `Las extensiones de archivo permitidas son ${validExtensions.join(
              ", "
            )}`
          );
          image.value = "";
          break;
          // si hay una que no, rompemos le loop
        }
      }
    }
  }

  // validacion imagen que no quede vacía al hacer submit
  function validateImageEmpty() {
    // are files extensions ok?
    if (image.value == "") {
      setInvalid(image, `Por favor, introduzca imágenes para el producto`);
      return false;
    }
  }

  // validacion category
  function validateCategory() {
    // is Empty?
    if (checkIfEmpty(category)) {
      return;
    }
    setValid(category);
    subcategory.focus();
    return true;
  }

  // validacion brand
  function validateBrand() {
    // is Empty?
    if (checkIfEmpty(brand)) {
      return;
    }
    setValid(brand);
    price.focus();
    return true;
  }

  // validacion price
  function validatePrice() {
    price.classList.remove("on-focus");
    // is Empty?
    if (checkIfEmpty(price)) {
      return;
    }

    // is a number? Lo que convierte da como resultado un NaN?
    if (Number.isNaN(Number(price.value))) {
      setInvalid(price, `Debes introducir un número`);
    } else {
      setValid(price);
      discount.focus();
      return true;
    }
  }

  // validacion discount
  function validateDiscount() {
    discount.classList.remove("on-focus");
    // is Empty?
    if (checkIfEmpty(discount)) {
      return;
    }

    // is a number? Lo que convierte da como resultado un NaN?
    if (Number.isNaN(Number(discount.value))) {
      setInvalid(discount, `Debes introducir un número`);
    } else {
      setValid(discount);
      sale.focus();
      return true;
    }
  }

  // validacion sale
  function validateSale() {
    // is Empty?
    if (checkIfEmpty(sale)) {
      return;
    }
    setValid(sale);
    size.focus();
    return true;
  }

  // validacion size
  function validateSize() {
    // is Empty?
    if (checkIfEmpty(size)) {
      return;
    }
    setValid(size);
    stock.focus();
    return true;
  }

  // validacion stock
  function validateStock() {
    // is Empty?
    console.log(stock.value);
    if (checkIfEmpty(stock)) {
      return;
    }
    setValid(stock);
    return true;
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

  // al hacer focus y al irse se validan los fields
  name.addEventListener("focus", function () {
    elementOnFocus(name);
  });
  name.addEventListener("blur", function () {
    validateName();
  });

  description.addEventListener("focus", function () {
    elementOnFocus(description);
  });
  description.addEventListener("blur", function () {
    validateDescription();
  });

  image.addEventListener("change", function () {
    validateImage();
  });

  price.addEventListener("focus", function () {
    elementOnFocus(price);
  });
  price.addEventListener("blur", function () {
    validatePrice();
  });

  discount.addEventListener("focus", function () {
    elementOnFocus(discount);
  });
  discount.addEventListener("blur", function () {
    validateDiscount();
  });
};
