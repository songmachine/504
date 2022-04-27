import { getEnv } from "./env";

const config: {
    port: number;
    backServiceURL: string;
    services: {
        front: boolean;
        back: boolean;
    };
    front: {
        defaultRequests: number;
    }
    back: {
        minProcessingMS: number;
        maxProcessingMS: number;
    }
} = {
    port: getEnv("PORT", 3000),
    backServiceURL: getEnv("BACK_SERVICE_URL", "http://127.0.0.1:3000/back"),
    services: {
        front: getEnv("SVC_FRONT", true),
        back: getEnv("SVC_BACK", true),
    },
    front: {
        defaultRequests: getEnv("DEFAULT_REQUESTS", 250),
    },
    back: {
        minProcessingMS: getEnv("MIN_PROCESSING_MS", 50),
        maxProcessingMS: getEnv("MAX_PROCESSING_MS", 1500),
    }
};

export default config;
