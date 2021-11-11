// funcion para poner primera letra en mayúscula
const capFirstLetter = function (string) {
  const newString = string.charAt(0).toUpperCase() + string.slice(1);
  return newString;
};

module.exports = capFirstLetter;
