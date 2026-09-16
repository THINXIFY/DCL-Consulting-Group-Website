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
// CORS_ALLOWED_ORIGINS is a comma-separated allowlist (e.g.
// "https://dcl-consulting-group.com,https://dcl-frontend.onrender.com").
// Fail closed in production rather than silently default to
// Access-Control-Allow-Origin: * - the same philosophy already applied to
// MAIL_PROVIDER in lib/env.ts. Outside production this stays wide open
// (unchanged from before), so local dev and the Vite proxy keep working
// with zero configuration.
const corsAllowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
if (process.env.NODE_ENV === "production" && !corsAllowedOrigins?.length) {
  throw new Error(
    "CORS_ALLOWED_ORIGINS must be set in production (comma-separated list of allowed origins) - refusing to default to an open CORS policy.",
  );
}
app.use(cors(corsAllowedOrigins?.length ? { origin: corsAllowedOrigins } : undefined));
app.use(express.json({ limit: "15kb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
