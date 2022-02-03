import redis from "../../config/redis";

export function GetServerIP() {
  return new Promise((resolve, reject) => {
    redis.get("PUBLIC:IP", (err, reply) => {
      if (!err && reply) return resolve(reply);

      fetch("https://ipecho.net/plain")
        .then((res) => res.text())
        .then((ip) => {
          redis.set("PUBLIC:IP", ip);
          resolve(ip);
        })
        .catch((err) => reject(err));
    });
  });
}
