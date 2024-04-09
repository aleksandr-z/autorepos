export interface IRepositoryCounter {
    /**
     * Всего репозиториев
     */
    allRepositories: number;
    /**
     * Список репозиториев, куда не добавились developer
     */
    developersError: string[],
    /**
     * Список репозиториев, куда не добавились maintainer
     */
    maintainersError: string[],
    /**
     * Список репозиториев, которые не удалось создать
     */
    createdError: string[],
    /**
     * Список репозиториев, созданных ранее
     */
    existing: string[],
}

export interface IIssuesCounter {
    /**
     * Всего найденных репозиториев в группе или по префиксу
     */
    allRepositories: number;
    /**
     * Количество созданных
     */
    created: number;
    /**
     * Массив кортежей с названием задачи и репозиторием задача которую не удалось создать
     */
    issueError: [string, string][],
    /**
     * Массив кортежей с названием задачи и репозиторием задача в котором уже существует
     */
    existing: [string, string][],
}