// funcion para eliminar duplicados del array
const removeDuplicates = function (data) {
  let unique = [];
  data.forEach((elem) => {
    if (!unique.includes(elem)) {
      unique.push(elem);
    }
  });
  return unique;
};

module.exports = removeDuplicates;
