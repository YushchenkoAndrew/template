import { apiHost } from "../config";
import getConfig from "next/config";
import redis from "../config/redis";
import { ApiError, ApiTokens } from "../types/api";
import md5 from "./md5";

const { serverRuntimeConfig } = getConfig();
export function PassValidate(pass: string, pass2: string) {
  let equal = true;
  let max = pass.length > pass2.length ? pass.length : pass2.length;
  for (let i = 0; i < max; i++) {
    equal =
      equal &&
      i < pass2.length &&
      i < pass.length &&
      pass2.charAt(i) == pass.charAt(i);
  }
  return equal;
}

export function UpdateTokens(data: ApiTokens) {
  redis.set("API:Access", data.access_token);
  redis.set("API:Refresh", data.refresh_token);

  redis.expire("API:Access", 15 * 60);
  redis.expire("API:Refresh", 7 * 24 * 60 * 60);
}

export function ApiAuth() {
  return new Promise((resolve, reject) => {
    redis.get("API:Access", (err, reply) => {
      if (!err && reply) return resolve(reply);

      // If Access token expired, then refresh token
      redis.get("API:Refresh", (err, reply) => {
        if (!err && reply) {
          return fetch(`http://${apiHost}/api/refresh`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              refresh_token: reply,
            }),
          })
            .then((res) => res.json())
            .then((data: ApiTokens | ApiError) => {
              if (data.status == "ERR")
                return reject("Incorrect refresh token value");

              UpdateTokens(data as ApiTokens);
              resolve((data as ApiTokens).access_token);
            })
            .catch((err) => reject(err));
        }

        // If Refresh token expired, then relogin
        let salt = Math.round(Math.random() * 10000).toString();
        fetch(`http://${apiHost}/api/login`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            user: serverRuntimeConfig.API_USER ?? "",
            pass:
              salt +
              "$" +
              md5(
                (serverRuntimeConfig.API_PEPPER ?? "") +
                  salt +
                  (serverRuntimeConfig.API_PASS ?? "")
              ),
          }),
        })
          .then((res) => res.json())
          .then((data: ApiTokens | ApiError) => {
            if (data.status == "ERR") return reject("Incorrect user or pass");

            UpdateTokens(data as ApiTokens);
            resolve((data as ApiTokens).access_token);
          })
          .catch((err) => reject(err));
      });
    });
  });
}
