// función para requerir al menos un checkbox
function onlyOneChecked(checkbox) {
  let tags = document.getElementsByClassName(checkbox);

  let atLeastOneChecked = false; //at least one checkbox is checked
  for (i = 0; i < tags.length; i++) {
    if (tags[i].checked === true) {
      atLeastOneChecked = true;
    }
  }

  if (atLeastOneChecked === true) {
    for (i = 0; i < tags.length; i++) {
      tags[i].required = false;
    }
  } else {
    for (i = 0; i < tags.length; i++) {
      tags[i].required = true;
    }
  }
}
