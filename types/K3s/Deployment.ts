import { Metadata } from "./Metadata";

export class Deployment {
  "apiVersion"?: string;
  "kind"?: string;
  "metadata"?: Metadata;
  "spec"?: Spec;
  "status"?: Status;
}

export class Status {
  "availableReplicas"?: number;
  "collisionCount"?: number;
  "observedGeneration"?: number;
  "readyReplicas"?: number;
  "replicas"?: number;
  "unavailableReplicas"?: number;
  "updatedReplicas"?: number;
}

export class Spec {
  "minReadySeconds"?: number;
  "paused"?: boolean;
  "progressDeadlineSeconds"?: number;
  "replicas"?: number;
  "revisionHistoryLimit"?: number;
  "selector": { matchLabels: { [key: string]: string } };
  "strategy"?: { type: "Recreate" | "RollingUpdate" };
  "template": Template;
}

export class Template {
  "metadata"?: Metadata;
  "spec"?: PodSpec;
}

export class PodSpec {
  "activeDeadlineSeconds"?: number;
  "automountServiceAccountToken"?: boolean;
  "containers": Container[];
  "enableServiceLinks"?: boolean;
  "hostIPC"?: boolean;
  "hostNetwork"?: boolean;
  "hostPID"?: boolean;
  "hostname"?: string;
  "initContainers"?: Container[];
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

export class Container {
  "args"?: string[];
  "command"?: string[];
  "env"?: { name: string; value?: string }[];
  "image"?: string;
  "imagePullPolicy"?: "IfNotPresent" | "Always" | "Never";
  "name": string;
  "ports"?: Port[];
  "resources"?: {
    limits?: { [key: string]: string };
    requests?: { [key: string]: string };
  };
  "stdin"?: boolean;
  "stdinOnce"?: boolean;
  "terminationMessagePath"?: string;
  "terminationMessagePolicy"?: string;
  "tty"?: boolean;
  // "volumeDevices"?:
  // "volumeMounts"?:
  "workingDir"?: string;
}

export class Port {
  "containerPort": number;
  "hostIP"?: string;
  "hostPort"?: number;
  "name"?: string;
  "protocol"?: string;
}
