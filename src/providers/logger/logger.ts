import {FileLogStrategy} from "./file-log-strategy";
import {BaseLogger} from "./base-logger";
import {ConsoleLogStrategy} from "./console-log-strategy";
import {ILogger} from "../../common/interfaces/logger";
import {IProjectDto} from "../../common/dto/project";
import {validAccessLevel} from "../../common/enum/access-level";

export class Logger implements ILogger {
    loggers: BaseLogger[];

    constructor() {
        this.loggers = [new BaseLogger(new FileLogStrategy()), new BaseLogger(new ConsoleLogStrategy())]
    }

    async addSuccess(text: string){
        for(let logger of this.loggers){
            await logger.addSuccess(text)
        }
    }

    async addError(text: string){
        for(let logger of this.loggers){
            await logger.addError(text)
        }
    }

    async addMember(userId: number, repositoryName: string, access_level: validAccessLevel) {
        for(let logger of this.loggers){
            await logger.addMember(userId, repositoryName, access_level)
        }
    }

    async addIssue(issueName: string, repositoryName: string) {
        for(let logger of this.loggers){
            await logger.addIssue(issueName, repositoryName);
        }
    }

    async memberExists(userId: number, repositoryName: string, access_level: validAccessLevel) {
        for(let logger of this.loggers){
            await logger.memberExists(userId, repositoryName, access_level)
        }
    }

    async addRepository(repository: IProjectDto) {
        for(let logger of this.loggers){
            await logger.addRepository(repository)
        }
    }

    async repositoryExists(repository: IProjectDto) {
        for(let logger of this.loggers){
            await logger.repositoryExists(repository)
        }
    }
}

export const logger = new Logger();