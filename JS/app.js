window.onscroll = function () {
  scrollFunc();
};

var menu = document.getElementById("menu");
var sticky = menu.offsetTop;

function scrollFunc() {
  if (window.pageYOffset >= sticky) menu.classList.add("sticky");
  else menu.classList.remove("sticky");
}
