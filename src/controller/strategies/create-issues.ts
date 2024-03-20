import {IStrategy} from "../../common/interfaces/strategy";
import {BaseStrategy} from "./base-strategy";
import {FileProvider} from "../../providers/file";
import {logger} from "../../providers/logger/logger";
import {IIssueDataFile} from "../../common/types/issue";
import {issueTypes} from "../../common/params/issue";
import {GitLabError} from "../../common/interfaces/error";

export class CreateIssues extends BaseStrategy implements IStrategy{
    private issues: FileProvider;
    constructor() {
        super();
        this.issues = new FileProvider('issues.json');
    }

    async runProcess(){
        let issues: IIssueDataFile[] = [];
        try {
            issues = await this.issues.readJson<IIssueDataFile[]>();
        } catch(e: any) {
            await logger.addError(e.message);
            throw e;
        }
        // получаем список репозиториев и отсеиваем по префиксу
        const repositories = await this.getRepositories();

        for(let repository of repositories){
            // получаем список задач и отсеиваем, чтоб не создать с одинаковым title
            const existingIssues = await this.gitLab.getIssueList(repository.id);
            const issueList = existingIssues.map(i => i.title);
            for(let issue of issues){
                try {
                    if(!issueList.includes(issue.title)){
                        await this.gitLab.createIssue(repository.id, { ...issue, issue_type: issueTypes.issue });
                    }
                    await logger.addIssue(issue.title, repository.name);
                } catch(e) {
                    const error = e as GitLabError;
                    await logger.addError(`Ошибка создания задачи для репозитория ${repository.name}. ${error.generalMessage}`);
                }

            }
        }
    }
}