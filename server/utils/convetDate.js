export const convertToShortDate = (dateIso) => {
  if (!dateIso) {
    return "";
  }
  if (dateIso.toString() === "Invalid Date") {
    return "n/a";
  }

  // Obtener los componentes de la fecha
  let dateToConvert = new Date(dateIso);
  var day = dateToConvert.getDate();
  var month = dateToConvert.getMonth() + 1;
  var year = dateToConvert.getFullYear();
  var hour = dateToConvert.getHours();
  console.log(hour);

  if (day.toString().length == 1) day = "0" + day;
  if (month.toString().length == 1) month = "0" + month;

  // Formatear la fecha en el orden día/mes/año
  var formatDate = month + "/" + day + "/" + year;

  return formatDate;
};
