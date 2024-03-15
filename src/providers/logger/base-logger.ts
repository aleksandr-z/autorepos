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
        await this.update(`Успех. Добавлена задача: ${issueName} в репозиторий: ${repositoryName}` + '\n');
    }

    async addRepository(repository: IProjectDto) {
        await this.update(`Успех. Создан репозиторий: ${repository.name} в группе: ${repository.namespace.name}` + '\n');
    }

    async repositoryExists(repository: IProjectDto){
        await this.update(`Успех. Получен существующий репозиторий: ${repository.name} в группе: ${repository.namespace.name}` + '\n');
    }

    async addMember(userId: number, repositoryName: string, access_level: validAccessLevel){
        await this.update(`Успех. Добавлен участник репозитория: ${repositoryName} с userId: ${userId}, с ролью ${validAccessLevel[access_level]}` + '\n');
    }

    async memberExists(userId: number, repositoryName: string, access_level: validAccessLevel){
        await this.update(`Успех. Пользователь уже является участником: ${repositoryName} с userId: ${userId}, с ролью ${validAccessLevel[access_level]}` + '\n');
    }

    async addError(text: string){
        await this.update(`Ошибка: ${text}` + '\n');
    }

    async addSuccess(text: string){
        await this.update(`${text}` + '\n');
    }

    get buffer(){
        return this._buffer;
    }
}
