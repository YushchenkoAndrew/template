var xhr = new XMLHttpRequest();
xhr.open("POST", "/db/1", true);

$.get("https://www.cloudflare.com/cdn-cgi/trace", (data) => {
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

google.charts.load("current", {
  packages: ["geochart"],
  mapsApiKey: "AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY",
});

xhr.onreadystatechange = () => {
  if (xhr.readyState == XMLHttpRequest.DONE) {
    console.log(JSON.parse(xhr.responseText));
    var db = JSON.parse(xhr.responseText);

    google.charts.setOnLoadCallback(() => {
      $.getJSON("./Country.json", (country) => {
        let data = [["Country", "Views"]];
        for (let i in db) data.push([country[db[i].Country] || db[i].Country, db[i].Count]);

        // Testing...
        // for (let i in country) data.push([country[i], Math.random() * 100]);

        var options = {
          colorAxis: {
            colors: ["#aed6f1", "#1b4f72"],
          },
        };

        var chart = new google.visualization.GeoChart(document.getElementById("regions_div"));
        chart.draw(google.visualization.arrayToDataTable(data), options);
      });
    });
  }
};
