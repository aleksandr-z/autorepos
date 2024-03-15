import {IProjectDto} from "../dto/project";
import {validAccessLevel} from "../enum/access-level";

export interface ILogger {
    addRepository(repository: IProjectDto): Promise<void>;
    repositoryExists(repository: IProjectDto): Promise<void>;
    memberExists(userId: number, repositoryName: string, access_level: validAccessLevel): Promise<void>;
    addMember(userId: number, repositoryName: string, access_level: validAccessLevel): Promise<void>;
    addError(text: string): Promise<void>;
    addIssue(issueName: string, repositoryName: string): Promise<void>;
    addSuccess(text: string): Promise<void>;
}