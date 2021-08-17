import React from "react";
import { Doughnut } from "react-chartjs-2";

export interface DoughnutCardProps {
  title: string;
}

export default function DoughnutCard(props: DoughnutCardProps) {
  let data = {
    labels: ["Red", "Green", "Yellow"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">{props.title}</h4>
        <div className="mt-2">
          <Doughnut data={data} height={400} width={400} />
        </div>
      </div>
    </div>
  );
}
