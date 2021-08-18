import React from "react";

export interface CardProps {
  title: string;
  children: React.ReactNode;
}

export default function Card(props: CardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">{props.title}</h4>
        <div className="mt-2">{props.children}</div>
      </div>
    </div>
  );
}
