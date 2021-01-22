$.get("https://www.cloudflare.com/cdn-cgi/trace", (data) => {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/projects/db/Visitor", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  data = data.split("\n");

  xhr.send(
    JSON.stringify({
      ip: data[2].split("=")[1],
      Country: data[8].split("=")[1],
      Visit_Date: new Date().toISOString().slice(0, 10),
    })
  );
});
