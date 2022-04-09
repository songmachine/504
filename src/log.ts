/*
 * Yet another light-weight logging solution.
 *
 * Use instead of console.log for all your logging needs.
 * There are just three levels, and that's fine.
 *
 * Logs to stdout in plain text or JSON format.
 * Configured by environment variables LOG_LEVEL and LOG_FORMAT,
 * defaults to "INFO" and "TEXT".
 */

import { strict as assert } from "assert";

export enum LogLevel {
    DEBUG = 4711,
    INFO,
    ERROR,
}

enum LogFormat {
    TEXT = 1337,
    JSON,
}

const stream = process.stdout;

export const logLevel: LogLevel = (() => {
    const levelName = process.env.LOG_LEVEL?.toUpperCase() ?? "INFO";
    return LogLevel[levelName as keyof typeof LogLevel] ?? LogLevel.INFO;
})();

const logFormat: LogFormat = (() => {
    const formatName = process.env.LOG_FORMAT?.toUpperCase() ?? "TEXT";
    return LogFormat[formatName as keyof typeof LogFormat] ?? LogFormat.TEXT;
})();

type LazyMessage = () => string;
type LogFunction = (...msg: Array<string | LazyMessage>) => void;

function nullLogFunction(): void {
    // /dev/null
}

export let error: LogFunction = nullLogFunction;
export let info: LogFunction = nullLogFunction;
export let debug: LogFunction = nullLogFunction;

function leveledLogFunction(logLevel: LogLevel, label?: string): LogFunction {
    const level = LogLevel[logLevel];
    if (logFormat === LogFormat.TEXT) {
        return function (...msg: Array<string | LazyMessage>) {
            const now = new Date().toISOString();
            const message = msg
                .map((arg) => {
                    if (typeof arg === "function") {
                        return arg();
                    }
                    return arg;
                })
                .join(" ");
            stream.write(`${now} [${level}] ${message}${"\n"}`);
        };
    } else if (logFormat === LogFormat.JSON) {
        return function (...msg: Array<string | LazyMessage>) {
            const timestamp = new Date();
            const message = msg
                .map((arg) => {
                    if (typeof arg === "function") {
                        return arg();
                    }
                    return arg;
                })
                .join(" ");
            const entry = {
                timestamp,
                message,
                label,
                level,
            };
            stream.write(JSON.stringify(entry) + "\n");
        };
    }
    assert(false);
    return nullLogFunction;
}

switch (logLevel) {
    case LogLevel.DEBUG:
        debug = leveledLogFunction(LogLevel.DEBUG);
    case LogLevel.INFO: // eslint-disable-line
        info = leveledLogFunction(LogLevel.INFO);
    case LogLevel.ERROR: // eslint-disable-line
        error = leveledLogFunction(LogLevel.ERROR);
}
