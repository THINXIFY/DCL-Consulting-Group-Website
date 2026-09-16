import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Trust exactly one reverse-proxy hop (this app's standard deployment
// topology puts one proxy/load balancer in front of it) so Express derives
// the real client IP from X-Forwarded-For for rate limiting. `1`, not
// `true` - `true` would trust the entire X-Forwarded-For chain, which a
// client can spoof to defeat per-IP rate limits.
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "15kb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
