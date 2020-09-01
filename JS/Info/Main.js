var xhr = new XMLHttpRequest();
xhr.open("POST", "/db", true);

$.get("https://www.cloudflare.com/cdn-cgi/trace", (data) => {
  xhr.setRequestHeader("Content-Type", "application/json");

  data = data.split("\n");

  console.log(data[2].split("=")[1]);
  console.log(data[8].split("=")[1]);
  console.log(new Date().toISOString().slice(0, 10));

  xhr.send(
    JSON.stringify({
      ip: data[2].split("=")[1],
      Country: data[8].split("=")[1],
      Visit_Date: new Date().toISOString().slice(0, 10),
    })
  );
});

$.get("http://example.com", function (responseText) {
  alert(responseText);
});

xhr.onreadystatechange = () => {
  if (xhr.readyState == XMLHttpRequest.DONE) {
    alert(xhr.responseText);
  }
};
