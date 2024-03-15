import {IStrategy} from "../../common/interfaces/strategy";
import {BaseStrategy} from "./base-strategy";
import {IProjectDto} from "../../common/dto/project";
import {logger} from "../../providers/logger/logger";
import {IStudent} from "../../common/types/students";
import {FileProvider} from "../../providers/file";
import {validAccessLevel} from "../../common/enum/access-level";
import {IMaintainer, IMaintainerLogin} from "../../common/types/maintainer";

export class CreateRepositories extends BaseStrategy implements IStrategy {
    private readonly students: FileProvider;
    private readonly maintainers: FileProvider;
    constructor() {
        super();
        this.students = new FileProvider('students.json');
        this.maintainers = new FileProvider('maintainers.json');
    }

    async runProcess(){
        let maintainersLogin: IMaintainerLogin[] = [];
        let students: IStudent[] = [];
        try {
            students = await this.students.readJson<IStudent[]>();
            maintainersLogin = await this.maintainers.readJson<IMaintainerLogin[]>();
            // todo: добавить типы ошибок и обработку
            // @ts-ignore
        } catch(e: any) {
            await logger.addError(e.message);
            throw e;
        }

        let maintainers: IMaintainer[] = [];
        try {
            maintainers = await this.getMaintainerIds(maintainersLogin);
        } catch(e) {
            await logger.addError('Не удалось получить список id всех maintainer');
            throw e;
        }

        const repos = await this.gitLab.getRepositories(this.groupId);
        for(let student of students){
            const repository = await this.createRepository(student.repository, repos);
            if(repository){
                const members = await this.getMembersByProject(repository.id, repository.name);
                await this.addDeveloper(repository, student.login, members);
                await this.addMaintainers(repository, maintainers, members);
            }
        }
    }

    /**
     * Создание репозитория
     * @param name
     * @param repos
     */
    private async createRepository(name: string, repos: IProjectDto[]){
        const repository = repos.find(item => item.name === name);
        if(repository){
            await logger.repositoryExists(repository);
            await this.setProtectedBranchRules(repository.id)
            return repository;
        } else {
            try {
                const createdRepository = await this.gitLab.createRepository({
                    name,
                    namespace_id: this.groupId,
                    approvals_before_merge: 1
                });
                await this.setProtectedBranchRules(createdRepository.id);
                await logger.addRepository(createdRepository);
                return createdRepository;
            } catch {
                await logger.addError(`Не удалось создать репозиторий ${name}`);
            }
        }
    }

    /**
     * Создание правил для главной ветки проекта
     * @param repositoryId
     */
    private async setProtectedBranchRules(repositoryId: number){
        try {
            await this.gitLab.setProtectedBranch(repositoryId, {
                name: this.defaultBranch,
            })
        // todo: поправить
        // @ts-ignore
        } catch(e: any) {
            // todo: сделать нормальную обработку ошибок на уровне httpclient
            console.log(`${e?.response?.status} ${e?.response?.statusText} ${e?.response?.data?.message}`);
        }
    }

    /**
     * Получение id всех мейнейнеров
     * @param maintainersLogin
     */
    private async getMaintainerIds(maintainersLogin: IMaintainerLogin[]): Promise<IMaintainer[]> {
        const maintainers: IMaintainer[] = [];
        for(let maintainer of maintainersLogin){
            const id = await this.gitLab.getUserId(maintainer.login);
            maintainers.push({
                login: maintainer.login,
                id
            })
        }
        return maintainers;
    }

    /**
     * Добавление мейнтейнеров (ответственных)
     * @param repository
     * @param maintainers
     * @param memberIDs
     */
    private async addMaintainers(repository: IProjectDto, maintainers: IMaintainer[], memberIDs: number[]){
        for(let maintainer of maintainers){
            try {
                if(memberIDs.includes(maintainer.id)){
                    await logger.memberExists(maintainer.id, maintainer.login, validAccessLevel.maintainer);
                    return;
                }
                await this.gitLab.addMember({
                    access_level: validAccessLevel.maintainer,
                    repositoryId: repository.id,
                    userId: maintainer.id
                });
                await logger.addMember(maintainer.id, maintainer.login, validAccessLevel.maintainer);
            }catch {
                await logger.addError(`Не удалось добавить мейнтейнера ${maintainer.login} (maintainer) в репозиторий ${repository.name}`)
            }
        }
    }

    /**
     * Добавление студента с ролью developer в проект
     * @param repository
     * @param login
     * @param memberIDs
     */
    private async addDeveloper(repository: IProjectDto, login: string, memberIDs: number[]){
        try {
            const userId = await this.gitLab.getUserId(login);
            if(memberIDs.includes(userId)){
                await logger.memberExists(userId, login, validAccessLevel.developer);
                return;
            }
            const member = await this.gitLab.addMember({
                access_level: validAccessLevel.developer,
                repositoryId: repository.id,
                userId
            });
            await logger.addMember(userId, login, validAccessLevel.developer);
            return;
        } catch {
            await logger.addError(`Не удалось добавить девелопера ${login} (developer) в репозиторий ${repository.name}`)
        }
    }

    /**
     * Получение списка идентификаторов участников репозитория
     * @param repositoryId
     * @param repositoryName
     */
    private async getMembersByProject(repositoryId: number, repositoryName: string): Promise<number[]>{
        try {
            const member = await this.gitLab.getMembersByProject(repositoryId);
            return member.map(m => m.id);
        } catch {
            await logger.addError(`Не удалось получить список участников для репозитория ${repositoryName}`);
            return [];
        }
    }


}