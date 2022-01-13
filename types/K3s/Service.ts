import { Metadata } from "./Metadata";

export class Service {
  "apiVersion"?: string;
  "kind"?: string;
  "metadata"?: Metadata;
  "spec"?: Spec;
  "status"?: {
    loadBalancer: { ingress: { hostname?: string; ip?: string }[] };
  };
}

export class Spec {
  "allocateLoadBalancerNodePorts"?: boolean;
  "clusterIP"?: string;
  "clusterIPs"?: string[];
  "externalIPs"?: string[];
  "externalName"?: string;
  "externalTrafficPolicy"?: string;
  "healthCheckNodePort"?: number;
  "internalTrafficPolicy"?: string;
  "ipFamilies"?: string[];
  "ipFamilyPolicy"?: string;
  "loadBalancerClass"?: string;
  "loadBalancerIP"?: string;
  "loadBalancerSourceRanges"?: string[];
  "ports"?: Port[];
  "publishNotReadyAddresses"?: boolean;
  "selector"?: { [key: string]: string };
  "type"?: string;
}

export class Port {
  "appProtocol"?: string;
  "name"?: string;
  "nodePort"?: number;
  "port": number;
  "protocol"?: string;
  "targetPort"?: object;
}

export class Status {}
