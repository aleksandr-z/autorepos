import {validAccessLevel} from "../enum/access-level";

export interface IProtectedBranchParam {
    /**
     * Наименование ветки
     */
    name: string;
    /**
     * Уровень доступа для пуша в ветку
     */
    push_access_level?: validAccessLevel;
    /**
     * Уровень доступа для мержа в ветку
     */
    merge_access_level?: validAccessLevel;
    /**
     * Уровень доступа для снятия защиты
     */
    unprotect_access_level?: validAccessLevel;
}