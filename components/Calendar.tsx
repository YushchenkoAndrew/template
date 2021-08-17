import React from "react";

export interface CalendarProps {
  title: string;
}

export default function Calendar(props: CalendarProps) {
  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">{props.title}</h4>
        <div className="mt-2">{/* // TODO: Calendar */}</div>
      </div>
    </div>
  );
}
