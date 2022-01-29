import React, { useImperativeHandle, useRef, useState } from "react";
import { Event } from "../../../pages/admin/projects/operation";
import { Port } from "../../../types/K3s/Service";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";

export interface PortProps {
  show?: boolean;
}

export interface PortRef {
  getValue: () => Port;
}

export default React.forwardRef((props: PortProps, ref) => {
  const [port, onPortChange] = useState<Port>({
    name: "",
    nodePort: "",
    port: "",
    protocol: "TCP",
    targetPort: "",
  });

  useImperativeHandle<unknown, PortRef>(ref, () => ({
    getValue: () =>
      Object.entries({
        ...port,
        port: Number(port.port ?? 0),
        nodePort: Number(port.nodePort ?? 0),
        targetPort: Number(port.targetPort ?? 0),
      } as Port).reduce(
        (acc, [key, item]) => (item ? { ...acc, [key]: item } : acc),
        {} as Port
      ),
  }));

  function onChange({ target: { name, value } }: Event) {
    onPortChange({ ...port, [name]: value });
  }

  return (
    <div
      className={`container border rounded mx-1 py-2 ${
        props.show ? "" : "d-none"
      }`}
    >
      <InputTemplate label="Name">
        <InputName
          char="@"
          name="name"
          value={port.name ?? ""}
          placeholder="void-port"
          onChange={onChange}
          // onBlur={onDataCache}
        />
      </InputTemplate>

      <InputTemplate label="Protocol">
        <InputRadio
          name="protocol"
          placeholder="TCP"
          className="btn-group btn-group-sm btn-group-toggle"
          options={["TCP", "UDP", "HTTP", "PROXY"]}
          label="btn-outline-info"
          onChange={onChange}
        />
      </InputTemplate>

      <div className="row w-100">
        <InputTemplate className="col-6" label="Port">
          <div className="input-group">
            <InputValue
              name="port"
              className="rounded"
              value={`${port.port ?? ""}`}
              placeholder="8000"
              onChange={onChange}
              // onBlur={onDataCache}
            />
          </div>
        </InputTemplate>

        <InputTemplate className="col-6" label="Target Port">
          <div className="input-group">
            <InputValue
              name="targetPort"
              className="rounded"
              value={`${port.targetPort ?? ""}`}
              placeholder="3000"
              onChange={onChange}
              // onBlur={onDataCache}
            />
          </div>
        </InputTemplate>
      </div>

      <InputTemplate label="Node Port">
        <div className="input-group">
          <InputName
            name="nodePort"
            char="?"
            value={`${port.nodePort ?? ""}`}
            placeholder="8000"
            onChange={onChange}
            // onBlur={onDataCache}
          />
        </div>
      </InputTemplate>
    </div>
  );
});
