import {GitlabProvider} from "../../providers/gitlab";
import {httpClient} from "../../providers/http-client";
import {config} from "../../providers/config";

export abstract class BaseStrategy {
    protected gitLab: GitlabProvider;
    protected groupId = Number(config.get('GROUP_ID'));
    protected defaultBranch: string = config.get<string>('DEFAULT_BRANCH');
    protected constructor() {
        if(!this.groupId){
            throw new Error('Необходимо указать номер группы в файл .env')
        }
        if(!this.defaultBranch){
            this.defaultBranch = 'main';
        }
        this.gitLab = new GitlabProvider(httpClient);
    }

    abstract runProcess(): Promise<void>;
}