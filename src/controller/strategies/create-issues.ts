import {IStrategy} from "../../common/interfaces/strategy";
import {BaseStrategy} from "./base-strategy";
import {FileProvider} from "../../providers/file";
import {logger} from "../../providers/logger/logger";
import {IIssueDataFile} from "../../common/types/issue";
import {issueTypes} from "../../common/params/issue";

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
        const repositories = await this.gitLab.getRepositories(this.groupId);
        for(let repository of repositories){
            for(let issue of issues){
                try {
                    await this.gitLab.createIssue(repository.id, { ...issue, issue_type: issueTypes.issue });
                    await logger.addIssue(issue.title, repository.name);
                } catch(e: any) {
                    await logger.addError(`Ошибка создания задачи для репозитория ${repository.name}`);
                }

            }
        }
    }
}