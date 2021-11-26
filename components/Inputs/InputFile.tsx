import React, { useRef, useState } from "react";
import { Event } from "../../pages/admin/projects/operation";
import { FileData } from "../../types/api";
import { ProjectElement } from "../../types/projects";

export interface InputFileProps {
  name: string;
  role: string;
  type?: string;
  required?: boolean;
  multiple?: boolean;
  message?: string;
  onChange: (event: ProjectElement) => void;
}

export default function InputFile(props: InputFileProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, onFileUpload] = useState<string | null>(null);

  function createFile(file: File): FileData {
    const form = new FormData();
    form.append("file", file);

    return {
      file,
      name: file.name,
      type: file.type,
      role: props.role,
      // ...(arg ?? {}),
    } as FileData;
  }

  return (
    <div className="input-group">
      <input
        name={props.name}
        type="file"
        ref={fileRef}
        className="d-none"
        required={props.required}
        multiple={props.multiple}
        accept={props.type}
        onChange={() => {
          console.log("HERE");
          console.log(fileRef.current?.files);

          if (!fileRef.current?.files?.[0]) return;
          onFileUpload(fileRef.current.files[0].name);

          let files = [] as FileData[];
          for (let i = 0; i < fileRef.current.files.length; i++) {
            files.push(createFile(fileRef.current.files[i]));
          }

          props.onChange({
            target: {
              name: props.name,
              value: files,
            },
          });
        }}
      />
      <button
        className={`btn ${
          file && !props.multiple ? "btn-success" : "btn-outline-info"
        }`}
        onClick={() => fileRef.current?.click()}
      >
        {file && !props.multiple ? file : "Upload"}
      </button>
      {props.required ? (
        <div className="invalid-tooltip">Thing field is required</div>
      ) : null}
    </div>
  );
}
