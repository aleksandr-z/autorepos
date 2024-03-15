export interface IssueParams {
    /**
     * Заголовок задачи
     */
    title: string;
    /**
     * Описание задачи
     */
    description: string;
    /**
     * ID юзера на кого будет назначена задача
     */
    assignee_id?: number;
    /**
     * Тип назначаемой задачи
     */
    issue_type?: issueTypes;
    /**
     * Лейблы
     */
    // todo: создать доп методы на создание и добавление лейблов https://docs.gitlab.com/ee/api/labels.html
    labels?: string[];
}

/**
 * Тип задачи
 */
export enum issueTypes {
    issue = 'issue',
    incident = 'incident',
    test_case = 'test_case'
}