import { Metadata } from "./Metadata";

export class Namespace {
  "apiVersion"?: string;
  "kind"?: string;
  "metadata"?: Metadata;
  "spec"?: { finalizers?: string[] };
  "status"?: { phase?: string };
}
