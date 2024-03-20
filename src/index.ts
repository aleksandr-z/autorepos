import inquirer from 'inquirer';
import { CreateRepositories } from "./controller/strategies/create-repositories";
import { CreateIssues } from "./controller/strategies/create-issues";
import { Controller } from "./controller/controller";
import {IPoll} from "./common/types/poll";
import {DeleteRepositories} from "./controller/strategies/delete-repositores";

// todo: добавить стратегию для созданию группы с сохранением ID в файл .env
const polls: IPoll[] = [{
    name: 'Создание репозиториев',
    value: new CreateRepositories()
},
{
    name: 'Создание задач',
    value: new CreateIssues()
},
{
    name: `Удаление всех репозиториев по префиксу ${process.env['PREFIX']}`,
    value: new DeleteRepositories()
}]

function run(){
    inquirer.prompt([
        {
            name: 'process',
            message: 'Что делаем?',
            type: 'list',
            choices: polls,
        }
    ])
        .then(async (answers) => {
            await new Controller(answers.process).start();
            run();
        })
        .catch((error: any) => {
            console.log(error);
            // todo: обработать ошибки
            if (error.isTtyError) {

                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else went wrong
            }
        });
}

run();
