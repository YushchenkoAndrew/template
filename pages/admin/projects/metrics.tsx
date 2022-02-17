import { withIronSession } from "next-iron-session";
import React from "react";
import redis from "../../../config/redis";
import { Doughnut, Line } from "react-chartjs-2";
import DefaultHeader from "../../../components/admin/default/DefaultHeader";
import DefaultNav from "../../../components/admin/default/DefaultNav";
import DefaultFooter from "../../../components/default/DefaultFooter";
import DefaultHead from "../../../components/default/DefaultHead";
import Card from "../../../components/info/Card";
import { apiUrl, basePath } from "../../../config";
import sessionConfig from "../../../config/session";
import { ApiAuth } from "../../../lib/api/auth";
import { checkIfUserExist } from "../../../lib/api/session";
import { MetricsData } from "../../../types/api";
import { DefaultRes } from "../../../types/request";
import { NextSessionArgs } from "../../../types/session";
import md5 from "../../../lib/md5";

const COLORS = [
  [249, 65, 68], // rgba(249,65,68,  0.6)
  [243, 114, 44], // rgba(243,114,44, 0.6)
  [248, 150, 30], // rgba(248,150,30, 0.6)
  [249, 199, 79], // rgba(249,199,79, 0.6)
  [144, 190, 109], // rgba(144,190,109,0.6)
  [67, 170, 139], // rgba(67,170,139, 0.6)
  [77, 144, 142], // rgba(77,144,142, 0.6)
  [87, 117, 144], // rgba(87,117,144, 0.6)
  [39, 125, 161], // rgba(39,125,161, 0.6)
];

const MONTH = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type MetricsType = {
  labels: string[];
  data: {
    name: string;
    cpu: number[];
    memory: number[];
    cpu_scale: number;
    memory_scale: number;
  }[];
};

export interface MetricsProps {
  containers: MetricsType;
}

export default function Metrics(props: MetricsProps) {
  return (
    <>
      <DefaultHead>
        <title>Metrics</title>
      </DefaultHead>
      <DefaultHeader />

      <div className="container">
        <div className="row mt-4 h-100">
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <Card title="Avg CPU Usage">
              <Doughnut
                height={100}
                width={100}
                options={{
                  animation: { duration: 1000 },
                }}
                data={{
                  labels: props.containers.data.map((data) => data.name),
                  datasets: [
                    {
                      data: props.containers.data.map((data) =>
                        data.cpu.reduce((acc, curr) => acc + curr)
                      ),
                      backgroundColor: COLORS.slice(3, 6).map(
                        (color) => `rgba(${color.join(",")},0.6)`
                      ),
                      hoverBackgroundColor: COLORS.slice(3, 6).map(
                        (color) => `rgb(${color.join(",")})`
                      ),
                    },
                  ],
                }}
              />
            </Card>
          </div>
          <div className="col-12 col-md-6 col-lg-4 mb-4">
            <Card title="Avg Memory Usage">
              <Doughnut
                height={100}
                width={100}
                options={{
                  animation: { duration: 1000 },
                }}
                data={{
                  labels: props.containers.data.map((data) => data.name),
                  datasets: [
                    {
                      data: props.containers.data.map((data) =>
                        data.memory.reduce((acc, curr) => acc + curr)
                      ),
                      backgroundColor: COLORS.slice(3, 6).map(
                        (color) => `rgba(${color.join(",")},0.6)`
                      ),
                      hoverBackgroundColor: COLORS.slice(3, 6).map(
                        (color) => `rgb(${color.join(",")})`
                      ),
                    },
                  ],
                }}
              />
            </Card>
          </div>
          <div className="col-12 col-md-6 col-lg-4 mb-4 h-100">
            <Card title="Uptime">
              <h1>5 days</h1>
            </Card>
          </div>
        </div>

        <div className="row px-3 mb-4">
          <Card title="CPU Usage">
            <Line
              height={1500}
              width={3000}
              options={{
                animation: { duration: 1000 },
                backgroundColor: "#000",
                scales: {
                  y: {
                    ticks: {
                      callback: (value) =>
                        `${((Number(value) / 4) * 100).toFixed(2)} %`,
                    },
                  },
                },
              }}
              data={{
                labels: props.containers.labels.map((item) => {
                  const date = new Date(Date.parse(item));
                  return [
                    `${date.getDate()} ${MONTH[date.getMonth()]}`,
                    `0${date.getHours()}:`.slice(-3) +
                      `0${date.getMinutes()}`.slice(-2),
                  ];
                }),
                datasets: props.containers.data.map((data, i) => ({
                  label: data.name,
                  // data: data.cpu.map(
                  //   (item) => item / Math.pow(10, data.cpu_scale)
                  // ),
                  data: data.cpu.map(
                    (item) =>
                      (item + i * Math.random() * 100000) /
                      Math.pow(10, data.cpu_scale)
                  ),
                  fill: i ? i - 1 : true,
                  backgroundColor: `rgba(${COLORS[i].join(",")},0.4)`,
                  borderColor: `rgb(${COLORS[i].join(",")})`,
                })),
              }}
            />
          </Card>
        </div>

        <div className="row px-3 mb-4">
          <Card title="Memory Usage">
            <Line
              height={1500}
              width={3000}
              options={{
                animation: { duration: 1000 },
                backgroundColor: "#000",
                scales: {
                  y: {
                    // TODO: Create a conversion form Number to Gi|Mi|Ki
                    // ticks: {
                    //   callback: (value) =>
                    //     `${((Number(value) / 4) * 100).toFixed(2)} %`,
                    // },
                  },
                },
              }}
              data={{
                labels: props.containers.labels.map((item) => {
                  const date = new Date(Date.parse(item));
                  return [
                    `${date.getDate()} ${MONTH[date.getMonth()]}`,
                    `0${date.getHours()}:`.slice(-3) +
                      `0${date.getMinutes()}`.slice(-2),
                  ];
                }),
                datasets: props.containers.data.map((data, i) => ({
                  label: data.name,
                  // data: data.cpu.map(
                  //   (item) => item / Math.pow(10, data.cpu_scale)
                  // ),
                  data: data.memory.map(
                    (item) =>
                      (item + i * Math.random() * 100000) /
                      Math.pow(10, data.memory_scale)
                  ),
                  fill: i ? i - 1 : true,
                  backgroundColor: `rgba(${COLORS[i + 3].join(",")},0.4)`,
                  borderColor: `rgb(${COLORS[i + 3].join(",")})`,
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

export const getServerSideProps = withIronSession(async function ({
  req,
}: NextSessionArgs) {
  const sessionID = req.session.get("user");
  const isOk = await checkIfUserExist(sessionID);

  if (!sessionID || !isOk) {
    return {
      redirect: {
        basePath: false,
        destination: `${basePath}/admin/login`,
        permanent: false,
      },
    };
  }

  let id: string | null;
  const params = new URLSearchParams((req.url ?? "").split("?")[1] ?? "");
  if (!(id = params.get("id"))) return { notFound: true };

  try {
    const result = await new Promise<string>((resolve) =>
      redis.get(`Metrics:${md5(id ?? "")}`, (err, reply) =>
        resolve(!err && reply ? reply : "")
      )
    );

    if (result) return { props: JSON.parse(result) };

    const token = await ApiAuth();
    const res = await fetch(`${apiUrl}/k3s/pods/metrics/${id}`, {
      headers: { Authorization: `Bear ${token}` },
    });
    const data = (await res.json()) as DefaultRes<MetricsData[]>;
    if (data.status !== "OK" || !data.result?.length) return { notFound: true };

    // Sort containers by there names ....
    let maxCpuScale = -1;
    let maxMemoryScale = -1;
    let labels = {} as { [name: string]: number };
    const containers = data.result.reduce((acc, curr) => {
      labels[curr.created_at] = (labels[curr.created_at] ?? 0) + 1;
      maxCpuScale = maxCpuScale > curr.cpu_scale ? maxCpuScale : curr.cpu_scale;
      maxMemoryScale =
        maxMemoryScale > curr.memory_scale ? maxMemoryScale : curr.memory_scale;
      return {
        ...acc,
        [curr.name]: [...(acc[curr.name] ?? []), curr],
      };
    }, {} as { [name: string]: MetricsData[] });

    const len = Object.entries(containers).length;
    const props = {
      containers: {
        // Mmmmm Im not at the mood to create more efficient code then this
        // If it works then don't fix it
        labels: Object.entries(labels)
          .filter(([_, num]) => num == len)
          .map(([name]) => name),
        data: Object.entries(containers).map(([name, arr]) => ({
          name,
          cpu: arr
            .filter((item) => labels[item.created_at] == len)
            .map((item) =>
              item.cpu_scale == maxCpuScale
                ? item.cpu
                : item.cpu * Math.pow(10, maxCpuScale - item.cpu_scale)
            ),
          memory: arr
            .filter((item) => labels[item.created_at] == len)
            .map((item) =>
              item.memory_scale == maxMemoryScale
                ? item.memory
                : item.memory * Math.pow(10, maxMemoryScale - item.memory_scale)
            ),
          cpu_scale: maxCpuScale,
          memory_scale: maxMemoryScale,
        })),
      },
    } as MetricsProps;

    redis.set(`Metrics:${md5(id ?? "")}`, JSON.stringify(props));
    redis.expire(`Metrics:${md5(id ?? "")}`, 60 * 60);

    return { props };
  } catch (err) {
    return { notFound: true };
  }
},
sessionConfig);
