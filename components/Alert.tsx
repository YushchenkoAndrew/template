import React, { CSSProperties, useEffect, useState } from "react";

export interface AlertProps {
  onClose?: () => void;

  state?: string;
  title?: string;
  note?: string;
}

export default function Alert(props: AlertProps) {
  return !props.title ? (
    <></>
  ) : (
    <div className={`alert ${props.state} alert-dismissible fade show`}>
      <div className="text-center">
        <span>
          <h4 className="alert-heading">{props.title}</h4>
          <p>{props.note}</p>
        </span>
        <button className="close" onClick={() => props.onClose?.()}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  );
}
