window.onscroll = function () {
  scrollFunc();
};

var menu = document.getElementById("menu");
var sticky = menu ? menu.offsetTop : undefined;

function scrollFunc() {
  if (!sticky) return;

  if (window.pageYOffset >= sticky) menu.classList.add("sticky");
  else menu.classList.remove("sticky");
}

$.get("https://www.cloudflare.com/cdn-cgi/trace", (data) => {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/guest", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      data: data,
    })
  );
});
