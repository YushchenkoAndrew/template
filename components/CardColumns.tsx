import React from "react";

export interface CardColumnsProps {
  children: React.ReactNode;
}

export default function CardColumns(props: CardColumnsProps) {
  return (
    <div className="container mt-5">
      <div className="card-columns">{props.children}</div>
    </div>
  );
}
