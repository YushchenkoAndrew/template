import React, { useRef, useState } from "react";
import { Event } from "../../pages/admin/projects/[operation]";
import { ProjectElement, ProjectFile } from "../../types/projects";

export interface InputFileProps {
  name: string;
  role: string;
  type?: string;
  error?: boolean;
  multiple?: boolean;
  message?: string;
  onChange: (event: Event) => void;
}

export default function InputFile(props: InputFileProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, onFileUpload] = useState<string | null>(null);

  function createFile(file: File, arg?: Object): ProjectFile {
    const form = new FormData();
    form.append("test", file);
    console.log(form);

    return {
      file,
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
        className={`btn ${
          file && !props.multiple ? "btn-success" : "btn-outline-info"
        }`}
        onClick={() => fileRef.current?.click()}
      >
        {file && !props.multiple ? file : "Upload"}
      </button>
      {props.error ? (
        <div className="text-danger small w-100">Thing field is required</div>
      ) : null}
    </>
  );
}
