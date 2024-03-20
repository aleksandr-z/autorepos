import {ILoggerStrategy} from "../../common/interfaces/strategy";
import {IProjectDto} from "../../common/dto/project";
import {ILogger} from "../../common/interfaces/logger";
import {validAccessLevel} from "../../common/enum/access-level";

export class BaseLogger implements ILogger{
    private strategy: ILoggerStrategy;
    private _buffer: string = '';

    constructor(strategy: ILoggerStrategy) {
        this.strategy = strategy;
    }

    private async update(line: string){
        this._buffer = this._buffer + line;
        await this.strategy.log(line);
    }

    async addIssue(issueName: string, repositoryName: string) {
        await this.update(`Успех. Добавлена задача: ${issueName} в репозиторий: ${repositoryName}`);
    }

    async addRepository(repository: IProjectDto) {
        await this.update(`Успех. Создан репозиторий: ${repository.name} в группе: ${repository.namespace.name}`);
    }

    async repositoryExists(repository: IProjectDto){
        await this.update(`Успех. Получен существующий репозиторий: ${repository.name} в группе: ${repository.namespace.name}`);
    }

    async addMember(userId: number, repositoryName: string, access_level: validAccessLevel){
        await this.update(`Успех. Добавлен участник репозитория: ${repositoryName} с userId: ${userId}, с ролью ${validAccessLevel[access_level]}`);
    }

    async memberExists(userId: number, repositoryName: string, access_level: validAccessLevel){
        await this.update(`Успех. Пользователь уже является участником: ${repositoryName} с userId: ${userId}, с ролью ${validAccessLevel[access_level]}`);
    }

    async addError(text: string){
        await this.update(`Ошибка: ${text}`);
    }

    async addSuccess(text: string){
        await this.update(`${text}`);
    }
}
