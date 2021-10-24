import redis from "redis";
import { sendLogs } from "../lib/bot";

const PORT = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379;
const HOST = process.env.REDIS_HOST ?? "127.0.0.1";

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
