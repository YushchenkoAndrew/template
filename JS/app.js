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
