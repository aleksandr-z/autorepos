/**
 * Проект (Репозиторий)
 */
export interface IProjectDto {
    id: number;
    description: string | null;
    name: string;
    path: string;
    web_url: string;
    namespace: INameSpaceDto;
}

export interface INameSpaceDto {
    id: number;
    name: string;
    path: string;
    kind: string;
    full_path: string;
    web_url: string;
}