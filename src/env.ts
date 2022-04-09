/*
 * Environment variable getter.
 * Throws an error if the requested variable is not set, and no fallback is provided.
 * If a fallback value is provided, the function expects and returns a value of the same type.
 */
export function getEnv<T extends string | number | boolean | null>(
    key: string,
    fallback?: T
): T {
    const v = process.env[key];
    if (v === undefined) {
        if (fallback !== undefined) {
            return fallback;
        }
        throw new Error(`Expected environment variable "${key}"`);
    }
    if (typeof fallback === "boolean") {
        return !(v?.toString().toLowerCase() === "false" || !v) as T;
    }
    if (typeof fallback === "number") {
        return parseFloat(v) as T;
    }
    return v as T;
}

/*
 * Environment variable object getter.
 * Throws an error if the requested variable is not set, and no fallback is provided.
 * Returns an object of the given type created from the variable string value.
 *
 * To allow for unset variables, specify `null` as fallback.
 */
export function getEnvObject<T extends object>(
    key: string,
    objectType: new (v: string) => T,
    fallback?: T | null
): T | undefined {
    const v = getEnv<string>(key, fallback !== undefined ? "" : undefined);
    if (!v) {
        return fallback ?? undefined;
    }

    return new objectType(v);
}
