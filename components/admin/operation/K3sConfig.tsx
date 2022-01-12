import {
  faChevronDown,
  faChevronRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import { K3sDeployment, K3sNamespace } from "../../../config/placeholder";
import Deployment from "../K3s/Deployment";
import Ingress from "../K3s/Ingress";
import K3sField from "../K3s/K3sField";
import Namespace from "../K3s/Namespace";
import Service from "../K3s/Service";
import Terminal, { TerminalRef } from "../Terminal";

export interface K3sConfigProps {
  show?: boolean;
}

export interface K3sConfigRef {}

interface Any {
  [name: string]: any;
}

export default React.forwardRef((props: K3sConfigProps, ref) => {
  const [minimized, onMinimize] = useState({
    namespace: true,
    deployment: true,
    service: true,
    ingress: true,
    terminal: true,
  });

  const [namespace, onChangeNamespace] = useState<{ [key: number]: Any }>({
    0: K3sNamespace("te"),
  });
  const [deployment, onChangeDeployment] = useState<{ [key: number]: Any }>({
    0: K3sDeployment,
  });
  const [service, onChangeService] = useState([]);
  const [ingress, onChangeIngress] = useState([]);

  const terminalRef = useRef<TerminalRef>(null);

  return (
    <div className={props.show ? "" : "d-none"}>
      <div className="container mb-5">
        <K3sField
          name="Namespace"
          show={minimized.namespace}
          onHide={() =>
            onMinimize({ ...minimized, namespace: !minimized.namespace })
          }
        >
          {Object.values(namespace).map((item, index) => (
            <Namespace
              key={index}
              show={minimized.namespace}
              value={item}
              onChange={(value) => {
                onChangeNamespace({ ...namespace, [index]: value });
              }}
            />
          ))}
        </K3sField>

        <K3sField
          name="Deployment"
          show={minimized.deployment}
          onHide={() =>
            onMinimize({ ...minimized, deployment: !minimized.deployment })
          }
        >
          {Object.values(deployment).map((item, index) => (
            <Deployment
              key={index}
              show={minimized.deployment}
              value={item}
              onChange={(value) => {
                onChangeDeployment({ ...deployment, [index]: value });
              }}
            />
          ))}
        </K3sField>

        {/* <K3sField
          name="Service"
          show={minimized.service}
          onHide={() =>
            onMinimize({ ...minimized, service: !minimized.service })
          }
        >
          {service.map((item, index) => (
            <Service key={index} show={minimized.service} />
          ))}
        </K3sField>

        <K3sField
          name="Ingress"
          show={minimized.ingress}
          onHide={() =>
            onMinimize({ ...minimized, ingress: !minimized.ingress })
          }
        >
          {ingress.map((item, index) => (
            <Ingress key={index} show={minimized.ingress} />
          ))}
        </K3sField> */}

        <K3sField
          name="Terminal"
          show={minimized.terminal}
          onHide={() =>
            onMinimize({ ...minimized, terminal: !minimized.terminal })
          }
        >
          <Terminal ref={terminalRef} show={minimized.terminal} />
        </K3sField>
      </div>
    </div>
  );
});
