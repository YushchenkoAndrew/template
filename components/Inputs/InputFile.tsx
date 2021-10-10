import React, { useRef, useState } from "react";
import { ProjectElement, ProjectFile } from "../../types/projects";

export interface InputFileProps {
  name: string;
  role: string;
  type?: string;
  required?: boolean;
  multiple?: boolean;
  message?: string;
  onChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | ProjectElement
  ) => void;
}

export default function InputFile(props: InputFileProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, onFileUpload] = useState<string | null>(null);

  function createFile(file: File, arg?: Object): ProjectFile {
    return {
      name: file.name,
      type: file.type,
      role: props.role,
      ...(arg ?? {}),
    };
  }

  return (
    <>
      <input
        name={props.name}
        type="file"
        ref={fileRef}
        className="d-none"
        required={props.required}
        multiple={props.multiple}
        accept={props.type}
        onChange={() => {
          console.log(fileRef.current?.files);

          if (!fileRef.current?.files?.[0]) return;
          onFileUpload(fileRef.current.files[0].name);

          let files = [] as ProjectFile[];
          for (let i = 0; i < fileRef.current.files.length; i++) {
            files.push(createFile(fileRef.current.files[i]));
          }

          props.onChange({
            target: {
              name: props.name,
              value: props.multiple ? files : files[0],
            },
          });

          if (props.type !== "image/*") return;

          let reader = new FileReader();
          reader.readAsDataURL(fileRef.current.files[0]);
          reader.onloadend = (e) => {
            if (!fileRef.current?.files?.[0]) return;
            props.onChange({
              target: {
                name: props.name,
                value: createFile(fileRef.current.files[0], {
                  url: String(reader.result),
                }),
              },
            } as ProjectElement);
          };
        }}
      />
      <button
        className={`btn ${file ? "btn-success" : "btn-outline-info"} ml-3`}
        onClick={() => fileRef.current?.click()}
      >
        {file && !props.multiple ? file : "Upload"}
      </button>
      {props.required ? (
        <div className="invalid-feedback w-100">{props.message}</div>
      ) : null}
    </>
  );
}
