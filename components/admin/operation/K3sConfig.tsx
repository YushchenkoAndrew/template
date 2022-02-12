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
import { PreviewRef } from "./Preview";

export interface K3sConfigProps {
  show?: boolean;
  previewRef: React.RefObject<PreviewRef>;
}

export interface K3sConfigRef {
  onSubmit: () => Promise<any>;
}

type K3sRef = NamespaceRef | DeploymentRef | ServiceRef | IngressRef;

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
    async onSubmit() {
      function toastRes(id: React.ReactText, status: Stat, name: string) {
        toast.update(id, {
          render: status === "OK" ? `Created ${name}` : `${name}: Server Error`,
          type: status === "OK" ? "success" : "error",
          isLoading: false,
          ...ToastDefault,
        });
      }

      function resolvePromise(name: string, promise: Promise<Response>) {
        return new Promise((resolve, reject) => {
          const toastId = toast.loading("Please wait...");
          promise
            .then((res) => res.json())
            .then((data: DefaultRes) => {
              toastRes(toastId, data.status, name);
              resolve(data);
            })
            .catch((err) => {
              toastRes(toastId, "ERR", name);
              reject(err);
            });
        });
      }

      function sendAll(
        name: string,
        ref: React.RefObject<K3sRef>[]
      ): Promise<unknown>[] {
        return ref
          .filter((item) => item?.current)
          .map((item) => {
            const value = item.current?.getValue();
            const namespace = value?.metadata?.namespace ?? "";
            return resolvePromise(
              `${name} [${value?.metadata?.name ?? ""}]`,
              fetch(
                `${basePath}/api/k3s/create?type=${name}` +
                  (namespace ? `&namespace=${namespace}` : ""),
                {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify(value),
                }
              )
            );
          });
      }

      try {
        const tag = props.previewRef?.current?.tag ?? "";

        await new Promise<void>((resolve) => {
          // NOTE: If tag was not setted then just don't build a project
          // because it's doesn't contains anything except of thumbnail img
          if (!tag) return resolve();

          const toastId = toast.loading("Please wait...");
          fetch(
            `${basePath}/api/docker/build?tag=${tag}&path=/${
              props.previewRef?.current?.formData?.name ?? ""
            }`,
            {
              method: "POST",
              headers: { "content-type": "application/json" },
            }
          )
            .then((res) => res.text())
            .then((data) => {
              resolve();
              toastRes(toastId, "OK", "Docker image was created successfully");
              terminalRef.current?.runCommand?.(
                `docker build . -t ${tag}`,
                data
              );
            })
            .catch((err) => {
              resolve();
              toastRes(toastId, "ERR", "Error with Docker image creation");
              terminalRef.current?.runCommand?.(
                `docker build . -t ${tag}`,
                err
              );
            });
        });

        await Promise.all(sendAll("namespace", namespaceRef));
        await Promise.all(sendAll("deployment", deploymentRef));
        await Promise.all(sendAll("service", serviceRef));
        await Promise.all(sendAll("ingress", ingressRef));
      } catch (err) {
        console.log(err);
      }
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
          {namespace.map((_, index) => (
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
          {deployment.map((_, index) => (
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
          {service.map((_, index) => (
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
