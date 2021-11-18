import redis from "../config/redis";
import { sendLogs } from "./bot";

// Init simple Mutex for Docker with Redis
let nTries = 0;
export function busyMutex() {
  console.log("[MUTEX] Busy");
  return new Promise<boolean>((resolve, reject) => {
    redis.set("Mutex:Free", "0", (err, stat) => resolve(stat === "OK"));
  });
}

export function waitMutex() {
  return new Promise<boolean>((resolve, reject) => {
    redis.get("Mutex:Free", (err, reply) => {
      let stat: number;
      if (
        err ||
        reply === null ||
        isNaN((stat = Number(reply))) ||
        stat === 1
      ) {
        return busyMutex().then((res) => {
          nTries = 0;
          resolve(res);
          if (res) return;

          sendLogs({
            stat: "ERR",
            name: "WEB",
            file: "/api/mutext.ts",
            message: "There some problem with cache",
          });
        });
      }

      // If process waiting for mutex too long then unfreeze it and just
      // keep going, despite it state
      if (nTries++ > Number(process.env.MUTEX_INAFF ?? 10)) {
        nTries = 0;
        resolve(true);
      }

      // If mutex is busy then wait when it will be free
      console.log("[MUTEX] Wait");
      setTimeout(
        () => waitMutex().then((res) => resolve(res)),
        Number(process.env.MUTEX_WAIT ?? 10)
      );
    });
  });
}

export function freeMutex() {
  console.log("[MUTEX] Free");
  redis.set("Mutex:Free", "1");
}
