import React, { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import DefaultHeader from "../../../components/admin/default/DefaultHeader";
import DefaultNav from "../../../components/admin/default/DefaultNav";
import DefaultFooter from "../../../components/default/DefaultFooter";
import DefaultHead from "../../../components/default/DefaultHead";
import Card from "../../../components/info/Card";
import defaultServerSideHandler from "../../../lib/api/session";

const colors = [
  [
    [244, 232, 193],
    [160, 193, 185],
    [112, 160, 175],
    [112, 105, 147],
    [51, 30, 56],
  ],
  [
    [249, 65, 68],
    [243, 114, 44],
    [248, 150, 30],
    [249, 199, 79],
    [144, 190, 109],
    // [67, 170, 139],
    // [77, 144, 142],
    [87, 117, 144],
    [39, 125, 161],
  ],
];

const colors2 = [
  ["#F4E8C1", "#A0C1B9", "#70A0AF", "#706993", "#331E38"],
  [
    "rgba(249,65,68,  0.6)",
    "rgba(243,114,44, 0.6)",
    "rgba(248,150,30, 0.6)",
    "rgba(249,199,79, 0.6)",
    "rgba(144,190,109,0.6)",
    "rgba(67,170,139, 0.6)",
    "rgba(77,144,142, 0.6)",
    "rgba(87,117,144, 0.6)",
    "rgba(39,125,161, 0.6)",
  ],
  [
    "#001219",
    "#005F73",
    "#0A9396",
    "#94D2BD",
    "#E9D8A6",
    "#EE9B00",
    "#CA6702",
    "#BB3E03",
    "#AE2012",
    "#9B2226",
  ],
  [
    "rgba(255,99,132,0.6)",
    "rgba(54,162,235,0.6)",
    "rgba(75,192,192,0.6)",
    "rgba(255,205,86,0.6)",
  ],
];

export interface ProjectMetricsProps {}

export default function ProjectMetrics(props: ProjectMetricsProps) {
  const cpu = {
    labels: [
      "2022-02-15 21:09:10",
      "2022-02-15 21:10:10",
      "2022-02-15 21:11:10",
      "2022-02-15 21:12:10",
      "2022-02-15 21:13:10",
      "2022-02-15 21:14:10",
      "2022-02-15 21:15:10",
      "2022-02-15 21:16:10",
      "2022-02-15 21:17:10",
      "2022-02-15 21:18:10",
      "2022-02-15 21:19:10",
      "2022-02-15 21:20:10",
      "2022-02-15 21:21:10",
      "2022-02-15 21:22:10",
    ],
    data: [
      19795, 17300, 14869, 15833, 15132, 14276, 15491, 15621, 17335, 18624,
      17747, 16140, 13536, 17644,
    ],
  };

  return (
    <>
      <DefaultHead>
        <title>Metrics</title>
      </DefaultHead>
      <DefaultHeader />

      <div className="row">
        <div className="col-lg-8 col-md-12 mb-4">
          <Card title="Weekdays Statistics">
            <Line
              // height={300}
              // width={200}
              options={{
                // maintainAspectRatio: false,
                animation: { duration: 1000 },
                backgroundColor: "#000",
                scales: { y: { stacked: true } },
              }}
              data={{
                labels: cpu.labels,
                datasets: colors[1]
                  // .filter(() => Math.random() > 0.4)
                  .slice(0, 1)
                  .map((color, i) => ({
                    label: "First dataset" + color,
                    data: cpu.data.map((item) => item + i * 50),
                    // data: cpu.data.map((item) => Math.random() * 10),
                    fill: i ? i - 1 : true,
                    backgroundColor: `rgba(${color.join(",")},0.4)`,
                    borderColor: `rgb(${color.join(",")})`,
                  })),
              }}
            />
          </Card>
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

export const getServerSideProps = defaultServerSideHandler;
