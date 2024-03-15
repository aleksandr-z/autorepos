import "dotenv/config.js";

export class ConfigProvider {
    private readonly config: Record<string, string | undefined>
    constructor() {
        this.config = process.env;
    }
    get<T>(key: keyof typeof process.env){
        return this.config[key] as T;
    }
}

export const config = new ConfigProvider();

