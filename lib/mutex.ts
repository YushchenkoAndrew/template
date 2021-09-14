import redis from "../config/redis";

// Init simple Mutex for Docker with Redis

function finalGet(key: string) {
  return new Promise<string>((resolve, reject) => {
    redis.get(key, (err, reply) => {
      if (!reply || err) reject(err);
      resolve(reply ?? "");
    });
  });
}

export function getValue(key: string, handler?: Promise<string>) {
  return new Promise<string>((resolve, reject) => {
    redis.get("Mutex", (err, reply) => {
      if (!reply || err) {
        redis.set("Mutex", "0");
        (handler ?? finalGet(key))
          .then((res) => resolve(res))
          .catch((err) => reject(err))
          .finally(() => redis.incr("Mutex"));
      } else if (Number(reply) % 2 == 0) {
        setTimeout(function Wait() {
          redis.get("Mutex", (err, reply) => {
            if (!reply || err) reject(err);
            if (Number(reply) % 2 != 0) {
              // Mark that data in use
              redis.incr("Mutex");
              (handler ?? finalGet(key))
                .then((res) => resolve(res))
                .catch((err) => reject(err))
                .finally(() => redis.incr("Mutex"));
            } else setTimeout(Wait, Number(process.env.MUTEX_WAIT ?? 10));
          });
        }, Number(process.env.MUTEX_WAIT ?? 10));
      } else {
        redis.incr("Mutex");
        (handler ?? finalGet(key))
          .then((res) => resolve(res))
          .catch((err) => reject(err))
          .finally(() => redis.incr("Mutex"));
      }
    });
  });
}

export function setValue(key: string, value: string) {
  return new Promise((resolve, reject) => {
    redis.get("Mutex", (err, reply) => {
      if (!reply || err) {
        redis.set("Mutex", "0");
        redis.set(key, value);
        redis.incr("Mutex");
        resolve("");
      } else if (Number(reply) % 2 == 0) {
        setTimeout(function Wait() {
          redis.get("Mutex", (err, reply) => {
            if (!reply || err) reject(err);
            if (Number(reply) % 2 != 0) {
              // Mark that data in use
              redis.incr("Mutex");
              redis.set(key, value);
              redis.incr("Mutex");
              resolve("");
            } else setTimeout(Wait, Number(process.env.MUTEX_WAIT ?? 10));
          });
        }, Number(process.env.MUTEX_WAIT ?? 10));
      } else {
        redis.incr("Mutex");
        redis.set(key, value);
        redis.incr("Mutex");
      }
    });
  });
}
