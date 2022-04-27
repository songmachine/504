import Koa from "koa";
import bodyParser from "koa-bodyparser";

import config from "./config";


export function setupBackService(app: Koa) {
    app.use(bodyParser({enableTypes: ["text"]}));

    app.use(async (ctx, next) => {
        if (ctx.path.startsWith("/back")) {
            const { minProcessingMS, maxProcessingMS } = config.back;
            const processingTime =
                minProcessingMS +
                Math.random() * (maxProcessingMS - minProcessingMS);
            await sleep(processingTime);

            const body = String(ctx.request.body);

            ctx.set("content-type", "text/plain");
            ctx.body = `Processed: ${body.substring(
                0,
                50
            )}... in ${processingTime.toPrecision(4)}ms.`;
        }
        return next();
    });
}

function sleep(millis: number) {
    return new Promise((resolve) => setTimeout(resolve, millis));
}
