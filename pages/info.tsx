import React, { useState } from "react";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultFooter from "../components/default/DefaultFooter";
import DefaultNav from "../components/default/DefaultNav";
import CardStat from "../components/info/CardStat";
import { faEye, faGlobe, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Card from "../components/info/Card";
import Calendar from "react-calendar";
import { Doughnut, Line } from "react-chartjs-2";

export default function Info() {
  const [value, onChange] = useState(new Date());

  // TODO: Send to API date for receive data
  // console.log(value);

  const mapData = [
    { country: "cn", value: 1389618778 },
    { country: "in", value: 1311559204 },
    { country: "us", value: 331883986 },
    { country: "id", value: 264935824 },
    { country: "pk", value: 210797836 },
    { country: "br", value: 210301591 },
    { country: "ng", value: 208679114 },
    { country: "bd", value: 161062905 },
    { country: "ru", value: 141944641 },
    { country: "mx", value: 127318112 },
  ];

  let doughnutData = {
    labels: ["Red", "Green", "Yellow"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  let lineData = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <DefaultHead>
        <title>Mortis Info</title>
      </DefaultHead>

      <DefaultHeader info />

      <div className="container">
        <div className="card-group mt-2 mb-4">
          <CardStat title="New users" value={55} gain={-64} icon={faUserPlus} />
          <CardStat title="Views" value={55} gain={64} icon={faEye} />
          <CardStat title="Countries" value={55} icon={faGlobe} />
        </div>

        <div className="row">
          <div className="col-lg-4 col-md-12 mb-4">
            <Card title="Calendar">
              <Calendar onChange={onChange} value={value} />
            </Card>
          </div>
          <div className="col-lg-4 col-md-12 mb-4">
            <Card title="Visited Country">
              {/* <WorldMap color="#2a65db" size="lg" data={mapData} /> */}
              {/* <WorldMap color="red" size="lg" data={mapData} /> */}
            </Card>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-12 mb-4">
            <Card title="Sample text">
              <Line data={lineData} height={400} width={400} />
            </Card>
          </div>
          <div className="col-lg-4 col-md-12 mb-4">
            <Card title="Sample text">
              <Doughnut data={doughnutData} height={400} width={400} />
            </Card>
          </div>
        </div>
      </div>

      <DefaultFooter name="Menu">
        <ul className="list-unstyled">
          <DefaultNav style="text-muted" />
        </ul>
      </DefaultFooter>
    </>
  );
}
