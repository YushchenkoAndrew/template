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

    document.getElementById("total_count").innerHTML = db.reduce((acc, value) => {
      return { Count: acc.Count + value.Count };
    }).Count;

    google.charts.setOnLoadCallback(() => {
      $.getJSON("./Country.json", (country) => {
        let today = new Date().toISOString().slice(0, 10);
        let today_count = { count: 0, country: [] };

        let data = [["Country", "Views"]];
        for (let i in db) {
          data.push([country[db[i].Country] || db[i].Country, db[i].Count]);

          // Writing to table
          let row = document.getElementById("table").insertRow(Number(i) + 1);
          row.insertCell(0);
          row.insertCell(1);

          document.getElementById("table").rows[Number(i) + 1].cells[0].innerHTML = new Date(...db[i].Visit_Date.split("-")).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          document.getElementById("table").rows[Number(i) + 1].cells[1].innerHTML = country[db[i].Country] || db[i].Country;

          // Count how many people visited today
          if (db[i].Visit_Date.includes(today)) {
            today_count.count++;
            today_count.country.push(country[db[i].Country] || db[i].Country);
          }
        }

        document.getElementById("today_count").innerHTML = today_count.count;
        document.getElementById("tooltiptext").innerHTML = today_count.country.join("&nbsp;&nbsp;&nbsp;&nbsp");

        var options = {
          colorAxis: {
            colors: ["#aed6f1", "#1b4f72"],
          },
          // backgroundColor: { fill: "#222" },
        };

        var chart = new google.visualization.GeoChart(document.getElementById("regions_div"));
        chart.draw(google.visualization.arrayToDataTable(data), options);
      });
    });
  }
};
