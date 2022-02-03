import { NextApiRequest } from "next";

export function createQuery(obj: any) {
  const result = Object.entries(obj)
    .filter(([key, value]) => value)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return result === "" ? "" : "?" + result;
}

export function GetParam(value: string | string[]): string {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}
