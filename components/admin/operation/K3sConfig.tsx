import React, {
  createRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { basePath } from "../../../config";
import { ToastDefault } from "../../../config/alert";
import { DefaultRes, Stat } from "../../../types/request";
import Deployment, { DeploymentRef } from "../K3s/Deployment";
import Ingress, { IngressRef } from "../K3s/Ingress";
import K3sField from "../K3s/K3sField";
import Namespace, { NamespaceRef } from "../K3s/Namespace";
import Service, { ServiceRef } from "../K3s/Service";
import Terminal, { TerminalRef } from "../Terminal";

export interface K3sConfigProps {
  show?: boolean;
}

export interface K3sConfigRef {
  onSubmit: () => Promise<any>;
}

export default React.forwardRef((props: K3sConfigProps, ref) => {
  const [minimized, onMinimize] = useState({
    namespace: true,
    deployment: true,
    service: true,
    ingress: true,
    terminal: true,
  });

  const [namespace, onNamespaceChange] = useState<boolean[]>([]);
  const [namespaceRef, onNamespaceRefChange] = useState<
    React.RefObject<NamespaceRef>[]
  >([]);

  useEffect(() => {
    onNamespaceRefChange(
      namespace.map((_, i) => namespaceRef[i] || createRef<NamespaceRef>())
    );
  }, [namespace.length]);

  const [deployment, onDeploymentChange] = useState<boolean[]>([]);
  const [deploymentRef, onDeploymentRefChange] = useState<
    React.RefObject<DeploymentRef>[]
  >([]);

  useEffect(() => {
    onDeploymentRefChange(
      deployment.map((_, i) => deploymentRef[i] || createRef<DeploymentRef>())
    );
  }, [deployment.length]);

  const [service, onServiceChange] = useState<boolean[]>([]);
  const [serviceRef, onServiceRefChange] = useState<
    React.RefObject<ServiceRef>[]
  >([]);

  useEffect(() => {
    onServiceRefChange(
      service.map((_, i) => serviceRef[i] || createRef<ServiceRef>())
    );
  }, [service.length]);

  const [ingress, onIngressChange] = useState<boolean[]>([]);
  const [ingressRef, onIngressRefChange] = useState<
    React.RefObject<IngressRef>[]
  >([]);

  useEffect(() => {
    onIngressRefChange(
      ingress.map((_, i) => ingressRef[i] || createRef<IngressRef>())
    );
  }, [ingress.length]);

  const terminalRef = useRef<TerminalRef>(null);

  useImperativeHandle<unknown, K3sConfigRef>(ref, () => ({
    onSubmit() {
      function toastRes(id: React.ReactText, status: Stat, name: string) {
        toast.update(id, {
          render: status === "OK" ? `Created ${name}` : `${name}: Server Error`,
          type: status === "OK" ? "success" : "error",
          isLoading: false,
          ...ToastDefault,
        });
      }

      return Promise.all([
        ...namespaceRef
          .filter((item) => item?.current)
          .map(
            (item) =>
              new Promise((resolve, reject) => {
                const value = item.current?.getValue();
                const toastId = toast.loading("Please wait...");
                fetch(`${basePath}/api/admin/k3s/create?type=namespace`, {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify(value),
                })
                  .then((res) => res.json())
                  .then((data: DefaultRes) => {
                    toastRes(
                      toastId,
                      data.status,
                      `Namespace [${value?.metadata?.name ?? ""}]`
                    );
                    resolve(data);
                  })
                  .catch((err) => {
                    toastRes(
                      toastId,
                      "ERR",
                      `Namespace [${value?.metadata?.name ?? ""}]`
                    );
                    reject(err);
                  });
              })
          ),
        ...deploymentRef
          .filter((item) => item?.current)
          .map(
            (item) =>
              new Promise((resolve, reject) => {
                const value = item.current?.getValue();
                const toastId = toast.loading("Please wait...");
                fetch(`${basePath}/api/admin/k3s/create?type=deployment`, {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify(value),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    toastRes(
                      toastId,
                      data.status,
                      `Deployment [${value?.metadata?.name ?? ""}]`
                    );
                    resolve(data);
                  })
                  .catch((err) => {
                    toastRes(
                      toastId,
                      "ERR",
                      `Deployment [${value?.metadata?.name ?? ""}]`
                    );
                    reject(err);
                  });
              })
          ),
        ...serviceRef
          .filter((item) => item?.current)
          .map(
            (item) =>
              new Promise((resolve, reject) => {
                const value = item.current?.getValue();
                const toastId = toast.loading("Please wait...");
                fetch(`${basePath}/api/admin/k3s/create?type=service`, {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify(value),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    toastRes(
                      toastId,
                      data.status,
                      `Service [${value?.metadata?.name ?? ""}]`
                    );
                    resolve(data);
                  })
                  .catch((err) => {
                    toastRes(
                      toastId,
                      "ERR",
                      `Service [${value?.metadata?.name ?? ""}]`
                    );
                    reject(err);
                  });
              })
          ),
        ...ingressRef
          .filter((item) => item?.current)
          .map(
            (item) =>
              new Promise((resolve, reject) => {
                const value = item.current?.getValue();
                const toastId = toast.loading("Please wait...");
                fetch(`${basePath}/api/admin/k3s/create?type=ingress`, {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify(value),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    toastRes(
                      toastId,
                      data.status,
                      `Ingress [${value?.metadata?.name ?? ""}]`
                    );
                    resolve(data);
                  })
                  .catch((err) => {
                    toastRes(
                      toastId,
                      "ERR",
                      `Ingress [${value?.metadata?.name ?? ""}]`
                    );
                    reject(err);
                  });
              })
          ),
      ]);
    },
  }));

  return (
    <div className={props.show ? "" : "d-none"}>
      <div className="container mb-5">
        <K3sField
          name="Namespace"
          show={minimized.namespace}
          onAdd={() => onNamespaceChange([...namespace, true])}
          onHide={() =>
            onMinimize({ ...minimized, namespace: !minimized.namespace })
          }
        >
          {namespace.map((item, index) => (
            <Namespace
              key={`deployment-${index}`}
              ref={namespaceRef[index]}
              show={minimized.namespace}
            />
          ))}
        </K3sField>

        <K3sField
          name="Deployment"
          show={minimized.deployment}
          onAdd={() => onDeploymentChange([...deployment, true])}
          onHide={() =>
            onMinimize({ ...minimized, deployment: !minimized.deployment })
          }
        >
          {deployment.map((item, index) => (
            <Deployment
              ref={deploymentRef[index]}
              key={`deployment-${index}`}
              show={minimized.deployment}
            />
          ))}
        </K3sField>

        <K3sField
          name="Service"
          show={minimized.service}
          onAdd={() => onServiceChange([...service, true])}
          onHide={() =>
            onMinimize({ ...minimized, service: !minimized.service })
          }
        >
          {service.map((item, index) => (
            <Service
              ref={serviceRef[index]}
              key={index}
              show={minimized.service}
            />
          ))}
        </K3sField>

        <K3sField
          name="Ingress"
          show={minimized.ingress}
          onAdd={() => onIngressChange([...ingress, true])}
          onHide={() =>
            onMinimize({ ...minimized, ingress: !minimized.ingress })
          }
        >
          {ingress.map((item, index) => (
            <Ingress
              ref={ingressRef[index]}
              key={index}
              show={minimized.ingress}
            />
          ))}
        </K3sField>

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
