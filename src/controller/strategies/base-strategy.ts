import {GitlabProvider} from "../../providers/gitlab";
import {httpClient} from "../../providers/http-client";
import {config} from "../../providers/config";
import {setTimeout} from "timers";

export abstract class BaseStrategy {
    protected gitLab: GitlabProvider;
    protected prefix: string = config.get<string>('PREFIX');
    protected groupId = Number(config.get('GROUP_ID'));
    protected defaultBranch: string = config.get<string>('DEFAULT_BRANCH');
    protected constructor() {
        if(!this.prefix){
            throw new Error('Необходимо указать префикс для новых репозиториев')
        }
        if(!this.defaultBranch){
            this.defaultBranch = 'main';
        }
        this.gitLab = new GitlabProvider(httpClient);
    }

    abstract runProcess(): Promise<void>;

    /**
     * Получение всех репозиториев и фильтрация их по префиксу
     */
    async getRepositories(){
        const allRepositories = await this.gitLab.getRepositories();
        return allRepositories.filter(repository => repository.name.startsWith(this.prefix));
    }

    /**
     * Задержка в time
     */
    delay(time: number): Promise<void>{
        return new Promise((resolve: () => void) => {
            setTimeout(() => {
                resolve()
            }, time);
        })
    }
}