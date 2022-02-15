import {
  faChevronDown,
  faChevronRight,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  createRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Metadata } from "../../../types/K3s/Metadata";
import { Service } from "../../../types/K3s/Service";
import InputList from "../../Inputs/InputDoubleList";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import ListEntity from "../../Inputs/ListEntity";
import styles from "./Default.module.css";
import Port, { PortRef } from "./Port";

export interface ServiceProps {
  show?: boolean;
}

export interface ServiceRef {
  getValue: () => Service;
}

export default React.forwardRef((props: ServiceProps, ref) => {
  const [minimized, onMinimize] = useState({
    metadata: true,
    spec: true,
    selector: true,
    ports: true,
  });

  const [service, onServiceChange] = useState<Service>({
    apiVersion: "v1",
    kind: "Service",
    metadata: { name: "" },
    spec: {
      selector: {},
      type: "LoadBalancer",
    },
  });

  const [ports, onPortChange] = useState<boolean[]>([]);
  const [portsRef, onPortRefChange] = useState<React.RefObject<PortRef>[]>([]);

  useEffect(() => {
    onPortRefChange(ports.map((_, i) => portsRef[i] || createRef<PortRef>()));
  }, [ports.length]);

  let [labels, onLabelsChange] = useState({} as { [key: string]: string });

  useImperativeHandle<unknown, ServiceRef>(ref, () => ({
    getValue() {
      return {
        ...service,
        spec: {
          ...service.spec,
          selector: { ...labels },
          ports: portsRef.map((item) => item.current?.getValue()),
        },
      } as Service;
    },
  }));

  return (
    <div className={`card px-1 py-3 ${props.show ? "" : "d-none"}`}>
      <InputTemplate
        labelClassName="font-weight-bold mx-2"
        label={[
          "Metadata ",
          <FontAwesomeIcon
            icon={minimized.metadata ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() =>
          onMinimize({ ...minimized, metadata: !minimized.metadata })
        }
      >
        <div
          className={`row border rounded mx-1 py-2 ${
            minimized.metadata ? "" : "d-none"
          }`}
        >
          <InputTemplate className="col-6" label="Name">
            <InputName
              char="@"
              name="name"
              required
              value={service.metadata?.name ?? ""}
              placeholder="void-service"
              onChange={({ target: { name, value } }) => {
                onServiceChange({
                  ...service,
                  metadata: {
                    ...service.metadata,
                    [name]: value,
                  },
                });
              }}
              // onBlur={onDataCache}
            />
          </InputTemplate>

          <InputTemplate className="col-6" label="Namespace">
            <div className="input-group">
              <InputValue
                name="namespace"
                className="rounded"
                value={service.metadata?.namespace ?? ""}
                placeholder="demo"
                onChange={({ target: { name, value } }) => {
                  onServiceChange({
                    ...service,
                    metadata: {
                      ...service.metadata,
                      [name]: value,
                    },
                  });
                }}

                // onBlur={onDataCache}
              />
            </div>
          </InputTemplate>
        </div>
      </InputTemplate>

      <InputTemplate
        className="mx-1"
        labelClassName="font-weight-bold mx-1"
        label={[
          "Spec ",
          <FontAwesomeIcon
            icon={minimized.spec ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() => onMinimize({ ...minimized, spec: !minimized.spec })}
      >
        <div className={`border rounded p-2 ${minimized.spec ? "" : "d-none"}`}>
          <InputTemplate label="Cluster IP">
            <InputName
              char="$"
              name="clusterIP"
              value={service.spec?.clusterIP ?? ""}
              placeholder="10.0.171.239"
              onChange={({ target: { name, value } }) => {
                onServiceChange({
                  ...service,
                  spec: {
                    ...service.spec,
                    [name]: value,
                  },
                });
              }}
              // onBlur={onDataCache}
            />
          </InputTemplate>

          <InputTemplate label="Type">
            <InputRadio
              name="type"
              placeholder="LoadBalancer"
              className="btn-group btn-group-sm btn-group-toggle"
              options={[
                "ClusterIP",
                "NodePort",
                "LoadBalancer",
                "ExternalName",
              ]}
              overflow={{
                on: { className: "d-block d-sm-none", len: 6 },
                off: { className: "d-none d-sm-block", len: 0 },
              }}
              label="btn-outline-info"
              onChange={({ target: { name, value } }) => {
                onServiceChange({
                  ...service,
                  spec: {
                    ...service.spec,
                    [name]: value,
                  },
                });
              }}
            />
          </InputTemplate>

          <InputTemplate
            className="mt-1"
            label={[
              "Selector ",
              <FontAwesomeIcon
                icon={minimized.selector ? faChevronDown : faChevronRight}
              />,
            ]}
            onClick={() =>
              onMinimize({
                ...minimized,
                selector: !minimized.selector,
              })
            }
          >
            <div
              className={`border rounded py-2 ${
                minimized.selector ? "" : "d-none"
              }`}
            >
              <div className="container">
                <InputList
                  char={["var", "="]}
                  name={["name", "value"]}
                  placeholder={["app", "void"]}
                  onChange={(data) => {
                    if (!data["name"] || data["value"] === undefined) {
                      return false;
                    }
                    onLabelsChange({
                      ...labels,
                      [data["name"]]: data["value"],
                    });
                    return true;
                  }}
                />
                <ul className="list-group">
                  {Object.entries(labels).map(([name, value], i) => (
                    <div key={`matchLabels-${i}`} className="row">
                      <ListEntity
                        char={["var", "="]}
                        value={[name, value]}
                        onChange={() => {
                          let temp = { ...labels };
                          delete temp[name];
                          onLabelsChange(temp);
                        }}
                      />
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </InputTemplate>
        </div>
      </InputTemplate>

      <InputTemplate
        className="mx-1"
        labelClassName="font-weight-bold mx-1"
        label={[
          "Ports ",
          <FontAwesomeIcon
            icon={minimized.ports ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() => onMinimize({ ...minimized, ports: !minimized.ports })}
      >
        <div
          className={`border rounded px-1 py-2 ${
            minimized.ports ? "" : "d-none"
          }`}
        >
          {ports.map((show, index) => (
            <div
              key={`port-${index}`}
              className={`mb-3 w-100 ${styles["el-index"]}`}
            >
              <div className="row mx-1">
                <label
                  className="mx-1 mr-auto"
                  onClick={() => {
                    onPortChange({ ...ports, [index]: !ports[index] });
                  }}
                >
                  {`[${index}] `}
                  <FontAwesomeIcon
                    icon={show ? faChevronDown : faChevronRight}
                  />
                </label>
                <FontAwesomeIcon
                  className={`mr-1 ${styles["el-container"]} text-danger`}
                  icon={faTrashAlt}
                  size="lg"
                  fontSize="1rem"
                  onClick={() => {
                    onPortChange([
                      ...ports.slice(0, index),
                      ...ports.slice(index + 1),
                    ]);
                  }}
                />
              </div>
              <Port ref={portsRef[index]} show={show} />
            </div>
          ))}

          <div className="container my-2">
            <a
              className="btn btn-outline-success w-100"
              onClick={() => onPortChange([...ports, true])}
            >
              <FontAwesomeIcon
                className={`text-success ${styles["icon"]}`}
                icon={faPlus}
              />
            </a>
          </div>
        </div>
      </InputTemplate>
    </div>
  );
});
