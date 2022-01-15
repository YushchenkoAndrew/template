import { Metadata } from "./Metadata";

export class Ingress {
  "apiVersion"?: string;
  "kind"?: string;
  "metadata"?: Metadata;
  "spec"?: Spec;
  "status"?: {
    loadBalancer: { ingress: { hostname?: string; ip?: string }[] };
  };
}

export class Spec {
  // 'defaultBackend'?: V1IngressBackend;
  "ingressClassName"?: string;
  "rules"?: Rule[];
  "tls"?: {
    hosts?: string[];
    secretName?: string;
  };
}

export class Rule {
  "host"?: string;
  "http"?: { paths: Path[] };
}

export class Path {
  "backend"?: {
    service?: {
      name: string;
      port?: {
        name?: string;
        number?: string;
      };
    };
  };
  "path"?: string;
  "pathType"?: string;
}

export class Stat {}
