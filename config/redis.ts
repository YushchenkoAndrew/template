import redis from "redis";
import getConfig from "next/config";
import { sendLogs } from "../lib/api/bot";

const { serverRuntimeConfig } = getConfig();
const PORT = Number(serverRuntimeConfig.REDIS_PORT ?? 6379);
const HOST = serverRuntimeConfig.REDIS_HOST ?? "127.0.0.1";

const client = redis.createClient(PORT, HOST);

client.on("error", function (error) {
  sendLogs({
    stat: "ERR",
    name: "WEB",
    file: "/config/redis.ts",
    message: "Ohhh noooo, Cache is broken!!!",
    desc: error,
  });
});

export function FlushValue(key: string) {
  client.keys(`${key}:*`, function (err, keys) {
    if (err || !keys) return;
    keys.map((item) => client.del(item));
  });
}

// Test connection
client.ping();
export default client;
