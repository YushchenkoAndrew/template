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
          if (!fileRef.current?.files?.[0]) return;
          onFileUpload(fileRef.current.files[0].name);

          let files = [] as FileData[];
          for (let i = 0; i < fileRef.current.files.length; i++) {
            const form = new FormData();
            form.append("file", fileRef.current.files[i]);
            files.push({
              file: fileRef.current.files[i],
              name: fileRef.current.files[i].name,
              type: fileRef.current.files[i].type,
              role: props.role,
              path: "",
            });
          }

          (function ReadFiles(i: number) {
            return new Promise((resolve, reject) => {
              let reader = new FileReader();
              reader.readAsDataURL(files[i].file || new Blob());
              reader.onloadend = (e) => {
                files[i].url = String(reader.result);
                if (++i == files.length) return resolve(true);
                return ReadFiles(i).finally(() => resolve(true));
              };
            });
          })(0).finally(() => {
            props.onChange({
              target: {
                name: props.name,
                value: files,
              },
            });
          });
        }}
      />
      <button
        className={`btn ${
          file && !props.multiple ? "btn-success" : "btn-outline-info"
        }`}
        type="button"
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
