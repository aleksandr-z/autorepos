import {IHttpClient} from "../common/interfaces/http-client";
import {IProjectDto} from "../common/dto/project";
import {ICreateRepositoryParams} from "../common/params/create-project";
import {validAccessLevel} from "../common/enum/access-level";
import {IMemberDto} from "../common/dto/member";
import {IUserDto} from "../common/dto/user";
import {IProtectedBranchParam} from "../common/params/protect-branch";
import {IssueParams} from "../common/params/issue";
import {GitLabError} from "../common/interfaces/error";
import {AxiosError, AxiosResponse} from 'axios';
import {IIssueDto} from "../common/dto/issue";

export class GitlabProvider {
    private readonly httpClient: IHttpClient;
    constructor( httpClient: IHttpClient) {
        this.httpClient = httpClient;
    }

    /**
     * Получить список репозиториев
     */
    async getRepositories(): Promise<IProjectDto[]>{
        try {
            return await this.httpClient.get<IProjectDto[]>(`/projects?owned=true&per_page=100`);
        } catch(e: unknown){
            throw this.handleError(e as AxiosError);
        }
    }

    /**
     * Создание реопзитория
     * @param params
     */
    async createRepository(params: ICreateRepositoryParams): Promise<IProjectDto>  {
        try{
            const {
                name,
                default_branch,
                namespace_id,
                approvals_before_merge
            } = params;
            return await this.httpClient.post<IProjectDto>(`/projects`, {
                name,
                namespace_id,
                default_branch,
                approvals_before_merge,
                initialize_with_readme: true
            });
        } catch(e: unknown){
            throw this.handleError(e as AxiosError);
        }
    }


    /**
     * Добавление пользователей в проект
     * @param projectId - идентификатор проекта
     * @param userId - идентификатор пользователя
     * @param access_level - уровень доступа
     */
    async addMember({ repositoryId, userId, access_level = validAccessLevel.developer }: IMemberDto){
        try {
            return await this.httpClient.post<IMemberDto>(`/projects/${repositoryId}/members`, {
                id: repositoryId,
                user_id: userId,
                access_level,
            });
        } catch(e: unknown) {
            throw this.handleError(e as AxiosError);
        }
    }

    /**
     * Установка прав доступа на ветку
     * @param repositoryId - идентификатор проекта
     * @param options - опции
     */
    async setProtectedBranch(repositoryId: number, options: IProtectedBranchParam){
        try {
            const { name, push_access_level = validAccessLevel.maintainer, merge_access_level = validAccessLevel.maintainer, unprotect_access_level } = options || {};
            return await this.httpClient.post(`/projects/${repositoryId}/protected_branches`, {
                name,
                push_access_level,
                merge_access_level,
                unprotect_access_level
            });
        } catch (e: unknown) {
            throw this.handleError(e as AxiosError);
        }

    }


    /**
     * Получение список участников проекта
     */
    async getMembersByProject(repositoryID: number){
        try {
            return await this.httpClient.get<IUserDto[]>(`/projects/${repositoryID}/members`);
        } catch(e: unknown) {
            throw this.handleError(e as AxiosError);
        }
    }

    /**
     * Получение id пользователя по логину
     * @param login
     */
    async getUserId(login: string): Promise<number>{
        try {
            const user = await this.httpClient.get<IUserDto[]>(`/users?username=${login}`);
            return user[0].id;
        } catch (e: unknown) {
            throw this.handleError(e as AxiosError);
        }

    }

    /**
     * Получение списка задач по id репозитория
     * @param repositoryID
     */
    async getIssueList(repositoryID: number){
        try {
            return await this.httpClient.get<IIssueDto[]>(`/projects/${repositoryID}/issues`);
        } catch(e) {
            throw this.handleError(e as AxiosError);
        }
    }


    /***
     * Создание новой задачи
     * @param repositoryId - идентификатор репозитория
     * @param issue - описание задачи
     */
    async createIssue(repositoryId: number, issue: IssueParams){
        try {
            return await this.httpClient.post(`/projects/${repositoryId}/issues`, {
                ...issue
            });
        } catch(e: unknown) {
            throw this.handleError(e as AxiosError);
        }

    }


    /**
     * Получение всех репозиториев группы
     * @param groupId - идентификатор группы
     */
    async getProjectsFromGroup(groupId: number){
        try {
            return await this.httpClient.get<IProjectDto[]>(`/groups/${groupId}/projects`);
        } catch (e: unknown) {
            throw this.handleError(e as AxiosError);
        }
    }

    /**
     * УДаление реопзитория по идентификатору
     * @param repositoryId - идентификатор репозитория
     */
    async deleteProject(repositoryId: number){
        try {
            await this.httpClient.delete<IProjectDto[]>(`/projects/${repositoryId}`);
        } catch (e: unknown) {
            throw this.handleError(e as AxiosError);
        }
    }

    private handleError(e: AxiosError){
        if(e.response){
            return {
                ...e.response,
                message: e.message,
                generalMessage: this.errorGenerate(e.response)
            } as GitLabError;
        } else {
            return e.message;
        }
    }

    private errorGenerate(e: AxiosResponse): string{
        if(Array.isArray(e.data?.message?.name)){
            return `Статус: ${e.status} - ${e.statusText}, сообщение: ${e.data.message.name.join(', ')}`;
        }
        if(Array.isArray(e.data.base)){
            return `Статус: ${e.status} - ${e.statusText}, сообщение: ${e.data.base.join(', ')}`;
        }
        return `Статус: ${e.status} - ${e.statusText}, сообщение: ${e.data.message}`;
    }
}