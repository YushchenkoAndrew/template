import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useImperativeHandle, useState } from "react";
import { Namespace } from "../../../types/K3s/Namespace";
import InputName from "../../Inputs/InputName";
import InputTemplate from "../../Inputs/InputTemplate";

export interface NamespaceProps {
  show?: boolean;
}

export interface NamespaceRef {
  getValue: () => Namespace;
}

export default React.forwardRef((props: NamespaceProps, ref) => {
  const [minimized, onMinimized] = useState(true);
  const [namespace, onNamespaceChange] = useState<Namespace>({
    apiVersion: "v1",
    kind: "Namespace",
    metadata: { name: "" },
    spec: {},
    status: {},
  });

  useImperativeHandle<unknown, NamespaceRef>(ref, () => ({
    getValue: () => ({ ...namespace }),
  }));

  return (
    <div className={`card col-lg-6 p-3 m-3 ${props.show ? "" : "d-none"}`}>
      <InputTemplate
        labelClassName="font-weight-bold ml-2"
        label={[
          "Metadata ",
          <FontAwesomeIcon icon={minimized ? faChevronDown : faChevronRight} />,
        ]}
        onClick={() => onMinimized(!minimized)}
      >
        <div
          className={`container border rounded mx-1 py-2 ${
            minimized ? "" : "d-none"
          }`}
        >
          <InputTemplate className="w-100" label="Name">
            <InputName
              char="@"
              name="name"
              required
              value={namespace.metadata?.name ?? ""}
              placeholder="demo"
              onChange={({ target: { name, value } }) => {
                onNamespaceChange({
                  ...namespace,
                  metadata: {
                    ...namespace.metadata,
                    [name]: value,
                  },
                });
              }}
              // onBlur={onDataCache}
            />
          </InputTemplate>
        </div>
      </InputTemplate>
    </div>
  );
});
