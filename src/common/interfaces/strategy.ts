export interface IStrategy {
    runProcess: () => Promise<void>;
}

export interface ILoggerStrategy {
    log: (buffer: string) => Promise<void>;
}