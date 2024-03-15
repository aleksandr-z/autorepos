import {validAccessLevel} from "../enum/access-level";

export interface IMemberDto {
    repositoryId: number;
    userId: number;
    access_level?: validAccessLevel;
}