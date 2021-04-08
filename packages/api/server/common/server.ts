import express, { Application } from "express";
import path from "path";
import bodyParser from "body-parser";
import http from "http";
import os from "os";
import cookieParser from "cookie-parser";
import l from "./logger";

import errorHandler from "../api/middlewares/error.handler";
import * as OpenApiValidator from "express-openapi-validator";

const app = express();

export default class ExpressServer {
  private routes: (app: Application) => void;
  constructor() {
    const root = path.normalize(__dirname + "/../..");
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || "100kb" }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || "100kb",
      })
    );
    app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || "100kb" }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${root}/public`));

    const apiSpec = path.join(__dirname, "api.yml");
    const validateResponses = !!(
      process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION &&
      process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION.toLowerCase() === "true"
    );
    app.use(process.env.OPENAPI_SPEC || "/spec", express.static(apiSpec));
    app.use(
      OpenApiValidator.middleware({
        apiSpec,
        validateResponses,
        ignorePaths: /.*\/spec(\/|$)/,
      })
    );
  }

  router(routes: (app: Application) => void): ExpressServer {
    routes(app);

    const isProd = process.env.NODE_ENV === "production";
    if (isProd) {
      // Compute the build path and index.html path
      const buildPath = path.resolve(__dirname, "../../../ui/dist");
      const indexHtml = path.join(buildPath, "index.html");

      // Setup build path as a static assets path
      app.use(express.static(buildPath));
      // Serve index.html on unmatched routes
      app.get("*", (_req, res) => res.sendFile(indexHtml));
    }

    app.use(errorHandler);
    return this;
  }

  listen(port: number): Application {
    const welcome = (p: number) => (): void =>
      l.info(
        `up and running in ${
          process.env.NODE_ENV || "development"
        } @: ${os.hostname()} on port: ${p}}`
      );

    http.createServer(app).listen(port, welcome(port));

    return app;
  }
}
