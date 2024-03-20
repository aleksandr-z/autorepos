import {BaseStrategy} from "./base-strategy";
import {IProjectDto} from "../../common/dto/project";
import {logger} from "../../providers/logger/logger";
import inquirer from "inquirer";
import {GitLabError} from "../../common/interfaces/error";

/**
 * Удаление всех репозиториев из группы
 */
export class DeleteRepositories extends BaseStrategy {
    constructor() {
        super();
    }
    async runProcess() {
        const { startDeleting } = await inquirer.prompt([
            {
                name: 'startDeleting',
                message: 'Уверены, что требуется удалить все репозитории?',
                type: 'list',
                choices: [
                    {
                        name: 'Да',
                        value: true
                    },
                    {
                        name: 'Нет',
                        value: false

                }],
            }
        ]);
        if(startDeleting){
            try {
                let projects:IProjectDto[] = [];
                try {
                    projects = await this.getRepositories();
                } catch(e){
                    await logger.addError("Не удалось получить список проектов из группы");
                    throw e;
                }

                for (let project of projects){
                    try {
                        await this.gitLab.deleteProject(project.id);
                        await logger.addSuccess(`Репозиторий ${project.name} успешно удален`);
                    } catch(e) {
                        const error = e as GitLabError;
                        await logger.addError(error.generalMessage);
                    }
                }
            } catch(e){
                throw e;
            }
        }
    }
}