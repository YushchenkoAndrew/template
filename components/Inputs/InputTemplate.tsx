import React from "react";

export interface InputTemplateProps {
  label: string;
  children: React.ReactNode;
}

export default function InputTemplate(props: InputTemplateProps) {
  return (
    <div className="mb-3">
      <label>{props.label}</label>
      {props.children}
    </div>
  );
}
