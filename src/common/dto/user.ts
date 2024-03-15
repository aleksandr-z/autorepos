import {validAccessLevel} from "../enum/access-level";

export interface IUserDto {
    id: number;
    username: string;
    name: string;
    state: string;
    locked: boolean;
    avatar_url: string;
    access_level: validAccessLevel;
}