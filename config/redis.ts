import redis from "redis";

const PORT = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379;
const HOST = process.env.REDIS_HOST ?? "127.0.0.1";

const client = redis.createClient(PORT, HOST);

client.on("error", function (error) {
  console.error(error);
});

export default client;
