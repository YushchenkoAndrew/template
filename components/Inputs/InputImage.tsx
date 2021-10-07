import React, { useRef, useState } from "react";

export interface InputFileProps {
  name: string;
  required?: boolean | undefined;
  message?: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

// FIXME:
type FileType = { name: string; url: string | ArrayBuffer | null };

export default function InputFile(props: InputFileProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, onFileUpload] = useState<FileType | null>(null);

  return (
    <>
      <input
        name={props.name}
        type="file"
        ref={fileRef}
        className="d-none"
        required={props.required}
        onChange={() => {
          if (!fileRef.current?.files) return;

          let reader = new FileReader();
          reader.readAsDataURL(fileRef.current.files[0]);

          // FIXME:
          onFileUpload({
            name: fileRef.current.files[0].name,
            url: reader.result,
          });

          reader.onloadend = (e) => {
            onFileUpload({
              ...(file ?? ({} as FileType)),
              url: reader.result,
            });
          };
        }}
      />
      <button
        className={`btn ${file ? "btn-success" : "btn-outline-primary"}`}
        onClick={() => fileRef.current?.click()}
      >
        {file?.name ?? "Upload"}
      </button>
      {props.required ? (
        <div className="invalid-feedback w-100">{props.message}</div>
      ) : null}
      {file?.url ? <img src={file.url as string} /> : null}
    </>
  );
}
