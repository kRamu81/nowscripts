import { config } from "dotenv";
config();
import { server } from "./app";
import mongoose from "mongoose";
import env from "./utils/envalid";
import cron from "node-cron";
import { syncNewsletterArticles } from "./utils/newsletterSync";

mongoose
  .connect(env.MONGO_URI, {
    maxPoolSize: 100,
    minPoolSize: 10,
    retryWrites: true,
  })
  .then(async () => {
    server.listen(env.PORT);
    console.log("Server runninng at PORT :", env.PORT);

    // Initial sync on startup
    await syncNewsletterArticles();

    // Schedule sync every 6 hours
    cron.schedule("0 */6 * * *", () => {
      console.log("Running scheduled newsletter sync...");
      syncNewsletterArticles();
    });
  })
  .catch((err) => console.log(err));
