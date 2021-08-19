import React, { useEffect, useState } from "react";
import Card from "../components/info/Card";
import CardStat from "../components/info/CardStat";
import Calendar from "react-calendar";
import DefaultNav from "../components/default/DefaultNav";
import DefaultHead from "../components/default/DefaultHead";
import DefaultHeader from "../components/default/DefaultHeader";
import DefaultFooter from "../components/default/DefaultFooter";
import { WorldMap } from "../components/WorldMap/WorldMap";
import { Doughnut, Line } from "react-chartjs-2";
import { faEye, faGlobe, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Data as StatisticData, StatInfo, Country } from "./api/info/statistic";
import { Data as AnalyticsData, Analytics } from "./api/info/analytics";

export default function Info() {
  const [date, onDateChange] = useState(new Date());
  const [mapData, onMapLoad] = useState([] as Country[]);
  const [lineData, onLineLoad] = useState([] as Number[]);
  const [labels, onLabelsLoad] = useState([] as string[]);
  const [doughnutData, onDoughnutLoad] = useState([] as Number[]);
  const [infoData, onInfoLoad] = useState({
    users: { value: 0, gain: 0 },
    views: { value: 0, gain: 0 },
    countries: 0,
  } as StatInfo);
  const [chartSize, setChartSize] = useState({
    height: 310,
    width: 800,
    size: "xl",
  });

  useEffect(() => {
    function handleChartResize() {
      if (window.innerWidth <= 1200 && window.innerWidth > 992)
        return setChartSize({ height: 300, width: 800, size: "lg" });

      if (window.innerWidth <= 992 && window.innerWidth > 767)
        return setChartSize({ height: 400, width: 400, size: "xl" });

      if (window.innerWidth <= 767)
        return setChartSize({ height: 400, width: 400, size: "lg" });

      return setChartSize({ height: 310, width: 800, size: "xl" });
    }

    window.addEventListener("resize", handleChartResize);
    handleChartResize();

    return () => window.removeEventListener("resize", handleChartResize);
  }, []);

  useEffect(() => {
    loadStaticData(date);
    loadAnalyticsData(date);
  }, []);

  function loadStaticData(date: Date) {
    fetch(
      `/projects/api/info/statistic?date=${new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 10)}`
    )
      .then((res) => res.json())
      .then((data: StatisticData) => {
        if (data.stat !== "OK") return;
        onMapLoad(data.map);
        onInfoLoad(data.info);
      });
  }

  function loadAnalyticsData(date: Date) {
    fetch(
      `/projects/api/info/analytics?date=${new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 10)}`
    )
      .then((res) => res.json())
      .then((data: AnalyticsData) => {
        if (data.stat !== "OK") return;
        onLineLoad(data.line);
        onLabelsLoad(data.days);
        onDoughnutLoad([
          data.doughnut.ctr,
          data.doughnut.cr_media,
          data.doughnut.cr_projects,
        ]);
      });
  }

  return (
    <>
      <DefaultHead>
        <title>Mortis Info</title>
      </DefaultHead>

      <DefaultHeader info />

      <div className="container">
        <div className="card-group mt-2 mb-4">
          <CardStat
            title="New users"
            value={infoData.users.value}
            gain={infoData.users.gain}
            icon={faUserPlus}
          />
          <CardStat
            title="Views"
            value={infoData.views.value}
            gain={infoData.views.gain}
            icon={faEye}
          />
          <CardStat
            title="Countries"
            value={infoData.countries}
            icon={faGlobe}
          />
        </div>

        <div className="row">
          <div className="col-lg-4 col-md-12 mb-4">
            <Card title="Calendar">
              <Calendar
                onChange={(date: Date) => {
                  loadStaticData(date);
                  loadAnalyticsData(date);
                  onDateChange(date);
                }}
                value={date}
              />
            </Card>
          </div>
          <div className="col col-lg-8 col-md-12 mb-4">
            <Card title="Visited Country">
              <div className="d-flex justify-content-center">
                <WorldMap
                  color="#2a65db"
                  size={chartSize.size}
                  data={mapData}
                />
              </div>
            </Card>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8 col-md-12 mb-4">
            <Card title="Weekdays Statistics">
              <Line
                height={chartSize.height}
                width={chartSize.width}
                options={{ maintainAspectRatio: false }}
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Visitors",
                      data: lineData,
                      backgroundColor: ["rgba(255, 99, 132, 0.2)"],
                      borderColor: ["rgba(255, 99, 132, 1)"],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </Card>
          </div>
          <div className="col-lg-4 col-md-12 mb-4">
            <Card title="Analytics">
              <Doughnut
                height={100}
                width={100}
                data={{
                  labels: ["CTR", "CR(media)", "CR(projects)"],
                  datasets: [
                    {
                      data: doughnutData,
                      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                    },
                  ],
                }}
              />
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
