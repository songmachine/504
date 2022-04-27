import axios from "axios";
import Koa from "koa";
import config from "./config";

export function setupFrontService(app: Koa) {
    app.use(async (ctx, next) => {
        try {
            if (ctx.path.startsWith("/front")) {
                const reqsArg = ctx.query.reqs || config.front.defaultRequests;
                const reqs = Number(reqsArg);
                if (isNaN(reqs)) {
                    throw new Error("Invalid argument");
                }

                const bodies = generateBodies(reqs);

                const start = process.hrtime.bigint();

                const responses = await Promise.all(
                    bodies.map((body) =>
                        axios.post(config.backServiceURL, body, {
                            headers: { "content-type": "text/plain" },
                            validateStatus: () => true,
                        })
                    )
                );

                const duration = Number(process.hrtime.bigint() - start) / 1e6;
                const failed = responses
                    .filter((response) => response.status !== 200)
                    .map((response) => ({
                        headers: response.headers,
                        body: response.data,
                    }));

                ctx.set("content-type", "text/plain");
                ctx.body = [
                    `${reqs} subrequests processed in ${duration.toPrecision(
                        4
                    )}ms.`,
                    failed.length
                        ? `${failed.length} failed requests: ${JSON.stringify(
                              failed,
                              null,
                              2
                          )}`
                        : "",
                ].join("\n");
            }
        } catch (error) {
            ctx.throw(500, JSON.stringify(error));
        }
        return next();
    });
}

function generateBodies(number: number): string[] {
    const start = "A".charCodeAt(0);
    const end = "z".charCodeAt(0);

    const bodies = [...Array(number)].map(() => {
        const bodySize = Math.trunc(100 + Math.random() * 10e3);
        const body = String.fromCharCode(
            ...[...Array(bodySize)].map(
                () => start + (end - start) * Math.random()
            )
        );
        return `Message: ${body}`;
    });

    return bodies;
}
