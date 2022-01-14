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
import { Deployment, Status } from "../../../types/K3s/Deployment";
import { Metadata } from "../../../types/K3s/Metadata";
import InputList from "../../Inputs/InputDoubleList";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";
import ListEntity from "../../Inputs/ListEntity";
import Container, { ContainerRef } from "./Container";
import styles from "./Default.module.css";

export class V1Deployment {
  "apiVersion"?: string;
  "kind"?: string;
  "metadata"?: Metadata;
  "spec"?: V1Spec;
  "status"?: Status;
}

class V1Spec {
  "minReadySeconds"?: number;
  "paused"?: boolean;
  "progressDeadlineSeconds"?: number;
  "replicas"?: string;
  "revisionHistoryLimit"?: number;
  "selector"?: { matchLabels: { [key: string]: string } };
  "strategy"?: { type: string };
  "template"?: V1Template;
}
export class V1Template {
  "metadata"?: Metadata;
  "spec"?: V1PodSpec;
}

export class V1PodSpec {
  "activeDeadlineSeconds"?: number;
  "automountServiceAccountToken"?: boolean;
  "containers": React.RefObject<ContainerRef>[];
  "enableServiceLinks"?: boolean;
  "hostIPC"?: boolean;
  "hostNetwork"?: boolean;
  "hostPID"?: boolean;
  "hostname"?: string;
  // "initContainers"?: Container[];
  "nodeName"?: string;
  "nodeSelector"?: { [key: string]: string };
  "overhead"?: { [key: string]: string };
  "preemptionPolicy"?: string;
  "priority"?: number;
  "priorityClassName"?: string;
  "restartPolicy"?: string;
  "runtimeClassName"?: string;
  "schedulerName"?: string;
  "serviceAccount"?: string;
  "serviceAccountName"?: string;
  "setHostnameAsFQDN"?: boolean;
  "shareProcessNamespace"?: boolean;
  "subdomain"?: string;
  "terminationGracePeriodSeconds"?: number;
}

export interface DeploymentProps {
  show?: boolean;
}
export interface DeploymentRef {
  getValue: () => Deployment;
}

export default React.forwardRef((props: DeploymentProps, ref) => {
  const [minimized, onMinimize] = useState({
    metadata: true,
    spec: true,
    matchLabels: true,
    containers: true,
  });

  const [deployment, onDeploymentChange] = useState<V1Deployment>({
    apiVersion: "app/v1",
    kind: "Deployment",
    metadata: {},
    spec: {
      selector: { matchLabels: {} },
      template: {
        metadata: {},
        spec: {
          containers: [],
        },
      },
    },
  });

  const [containers, onContainerChange] = useState<boolean[]>([]);
  const [containersRef, onContainerRefChange] = useState<
    React.RefObject<ContainerRef>[]
  >([]);

  useEffect(() => {
    onContainerRefChange(
      containers.map((_, i) => containersRef[i] || createRef<ContainerRef>())
    );
  }, [containers.length]);

  let [labels, onLabelsChange] = useState({} as { [key: string]: string });

  useImperativeHandle<unknown, DeploymentRef>(ref, () => ({
    getValue() {
      return {
        ...deployment,
        spec: {
          ...deployment.spec,
          selector: { matchLabels: { ...labels } },
          template: {
            ...deployment.spec?.template,
            metadata: {
              ...deployment.spec?.template?.metadata,
              labels: { ...labels },
            },
            spec: {
              ...deployment.spec?.template?.spec,
              containers: containersRef.map((item) => item.current?.getValue()),
            },
          },
        },
      } as Deployment;
    },
  }));

  return (
    <div className={`card col-lg-6 p-3 m-3 ${props.show ? "" : "d-none"}`}>
      <InputTemplate
        labelClassName="font-weight-bold ml-2"
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
              value={deployment.metadata?.name ?? ""}
              placeholder="void-deployment"
              onChange={({ target: { name, value } }) => {
                onDeploymentChange({
                  ...deployment,
                  metadata: {
                    ...deployment.metadata,
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
                value={deployment.metadata?.namespace ?? ""}
                placeholder="demo"
                onChange={({ target: { name, value } }) => {
                  onDeploymentChange({
                    ...deployment,
                    metadata: {
                      ...deployment.metadata,
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
        labelClassName="font-weight-bold ml-2"
        label={[
          "Spec ",
          <FontAwesomeIcon
            icon={minimized.spec ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() => onMinimize({ ...minimized, spec: !minimized.spec })}
      >
        <div
          className={`container border rounded mx-1 py-2 ${
            minimized.spec ? "" : "d-none"
          }`}
        >
          <div className="row">
            <InputTemplate className="col-6" label="Replicas">
              <div className="input-group">
                <InputName
                  char="$"
                  name="replicas"
                  required
                  value={deployment.spec?.replicas ?? ""}
                  placeholder="1"
                  onChange={({ target: { name, value } }) => {
                    onDeploymentChange({
                      ...deployment,
                      spec: {
                        ...deployment.spec,
                        [name]: value,
                      },
                    });
                  }}
                  // onBlur={onDataCache}
                />
              </div>
            </InputTemplate>

            <InputTemplate className="col-6" label="Strategy">
              <InputRadio
                name="strategy"
                placeholder="RollingUpdate"
                className="btn-group btn-group-sm btn-group-toggle"
                options={["RollingUpdate", "Recreate"]}
                label="btn-outline-info"
                onChange={({ target: { name, value } }) => {
                  onDeploymentChange({
                    ...deployment,
                    spec: {
                      ...deployment.spec,
                      strategy: { type: value },
                    },
                  });
                }}
              />
            </InputTemplate>
          </div>

          <InputTemplate
            className="mt-1"
            label={[
              "MatchLabels ",
              <FontAwesomeIcon
                icon={minimized.matchLabels ? faChevronDown : faChevronRight}
              />,
            ]}
            onClick={() =>
              onMinimize({
                ...minimized,
                matchLabels: !minimized.matchLabels,
              })
            }
          >
            <div
              className={`border rounded py-2 ${
                minimized.matchLabels ? "" : "d-none"
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
        labelClassName="font-weight-bold ml-2"
        label={[
          "Containers ",
          <FontAwesomeIcon
            icon={minimized.containers ? faChevronDown : faChevronRight}
          />,
        ]}
        onClick={() =>
          onMinimize({ ...minimized, containers: !minimized.containers })
        }
      >
        <div
          className={`container border rounded py-2 ${
            minimized.containers ? "" : "d-none"
          }`}
        >
          {containers.map((show, index) => (
            <div
              key={`container-${index}`}
              className={`mb-3 w-100 ${styles["el-index"]}`}
            >
              <div className="row mx-1">
                <label
                  className="ml-1 mr-auto"
                  onClick={() => {
                    onContainerChange({
                      ...containers,
                      [index]: !containers[index],
                    });
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
                    onContainerChange([
                      ...containers.slice(0, index),
                      ...containers.slice(index + 1),
                    ]);
                  }}
                />
              </div>
              <Container ref={containersRef[index]} show={show} />
            </div>
          ))}

          <div className="container my-2">
            <a
              className="btn btn-outline-success w-100"
              onClick={() => onContainerChange([...containers, true])}
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
