import React from "react";

export interface InputTemplateProps {
  className?: string;
  label: string;
  children: React.ReactNode;
}

export default function InputTemplate(props: InputTemplateProps) {
  return (
    <div className={`mb-3 ${props.className ?? ""}`}>
      <label className="mr-3">{props.label}</label>
      {props.children}
    </div>
  );
}
