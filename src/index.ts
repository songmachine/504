import Koa from "koa";
import http from "http";
import config from "./config";
import * as log from "./log";
import koaLogger from "koa-logger";
import shutdown from "koa-graceful-shutdown";
import cors from "@koa/cors";
import { setupFrontService } from "./front";
import { setupBackService } from "./back";

async function main() {
    const app = new Koa();
    const server = http.createServer(app.callback());

    app.use(shutdown(server)).use(
        koaLogger({
            transporter: (str) => {
                log.info(str);
            },
        })
    ).use(cors({keepHeadersOnError: true}));

    if (config.services.front) {
        setupFrontService(app);
    }

    if (config.services.back) {
        setupBackService(app);
    }

    app.on("error", (error) => {
        log.error(error);
    });

    server.listen(config.port);
}

main()
    .then(() => {
        log.info(`Listening on port ${config.port}`);
    })
    .catch((error) => {
        log.error(error.message || error);
        if (error.graphqlErrors) {
            log.error(error.graphqlErrors.join("\n"));
        }
        process.exit(2);
    });
