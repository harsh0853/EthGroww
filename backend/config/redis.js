import redis from "redis";

const client = redis.createClient({
  socket: {
    host: "localhost",
    // Use your Redis server address if different
    port: 6379,
  },
});

client.on("connect", () => {
  console.log("✅ Connected to Redis successfully!");
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error("❌ Redis Connection Failed:", err);
  }
})();
//client.connect();

export { client };
