const navbar = document.querySelector(".nav-list");
const toggle = document.querySelector(".toggle-btn");

// si se hace click en el toggle-btn. Si navbar tiene la clase 'is-open' se la quita, si no, se la pone
toggle.addEventListener("click", () => {
  navbar.classList.toggle("is-open");
  toggle.classList.toggle("close");
});
