import {IStrategy} from "../../common/interfaces/strategy";
import {BaseStrategy} from "./base-strategy";
import {FileProvider} from "../../providers/file";
import {logger} from "../../providers/logger/logger";
import {IIssueDataFile} from "../../common/types/issue";
import {issueTypes} from "../../common/params/issue";
import {GitLabError} from "../../common/interfaces/error";
import {IIssuesCounter} from "../../common/types/counter";

export class CreateIssues extends BaseStrategy implements IStrategy {
    private issues: FileProvider;
    private counter: IIssuesCounter = {
        allRepositories: 0,
        existing: [],
        issueError: [],
        created: 0,
    }
    constructor() {
        super();
        this.issues = new FileProvider('issues.json');
    }

    async runProcess(){
        this.counter = {
            allRepositories: 0,
            existing: [],
            issueError: [],
            created: 0,
        };
        let issues: IIssueDataFile[] = [];
        try {
            issues = await this.issues.readJson<IIssueDataFile[]>();
        } catch(e: any) {
            await logger.addError(e.message);
            throw e;
        }
        // получаем список репозиториев и отсеиваем по префиксу
        const repositories = await this.getRepositories();
        this.counter.allRepositories = repositories.length;
        for(let repository of repositories){
            // получаем список задач и отсеиваем, чтоб не создать с одинаковым title
            const existingIssues = await this.gitLab.getIssueList(repository.id);
            const issueList = existingIssues.map(i => i.title);
            for(let issue of issues){
                try {
                    if(!issueList.includes(issue.title)){
                        await this.gitLab.createIssue(repository.id, { ...issue, issue_type: issueTypes.issue });
                        await logger.addIssue(issue.title, repository.name);
                        this.counter.created++;
                    } else {
                        this.counter.existing.push([issue.title, repository.name]);
                        await logger.addSuccess(`Задача ${issue.title} уже существует в репозитории ${repository.name}`);
                    }
                    await this.delay(100);
                } catch(e) {
                    const error = e as GitLabError;
                    this.counter.issueError.push([issue.title, repository.name]);
                    await logger.addError(`Ошибка создания задачи для репозитория ${repository.name}. ${error.generalMessage}`);
                }

            }
        }
        const existingIssues = this.counter.existing.reduce((acc, item) => {
            return acc ? acc + ', ' + item.join(' для ') : item.join(' для ');
        }, '')
        await logger.addSuccess(`\nВсего репозиториев для создания задач: ${this.counter.allRepositories}\nСоздано задач: ${this.counter.created}\nСуществующие: ${existingIssues || 0}\nОшибка создания: ${this.counter.issueError.join(', ') || 0}\n`);
    }
}