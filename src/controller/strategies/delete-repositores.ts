import {BaseStrategy} from "./base-strategy";
import {IProjectDto} from "../../common/dto/project";
import {logger} from "../../providers/logger/logger";
import inquirer from "inquirer";

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
                    projects = await this.gitLab.getProjectsFromGroup(this.groupId);
                } catch(e){
                    await logger.addError("Не удалось получить список проектов из группы");
                    throw e;
                }

                for (let project of projects){
                    try {
                        await this.gitLab.deleteProject(project.id);
                        await logger.addSuccess(`Репозиторий ${project.name} успешно удален`);
                    // @ts-ignore
                    } catch(e: any) {
                        await logger.addError(e.response?.data?.message);
                    }
                }
            } catch(e){
                throw e;
            }
        }
    }
}