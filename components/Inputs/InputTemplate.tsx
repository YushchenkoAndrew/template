import React from "react";

export interface InputTemplateProps {
  className?: string;
  labelClassName?: string;
  label: any;
  children: React.ReactNode;
  onClick?: () => void;
}

export default function InputTemplate(props: InputTemplateProps) {
  return (
    <div className={`mb-3 ${props.className ?? ""}`}>
      <label
        className={`mr-3 ${props.labelClassName ?? ""}`}
        onClick={props.onClick}
      >
        {props.label}
      </label>
      {props.children}
    </div>
  );
}
