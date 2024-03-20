import { AxiosResponse } from 'axios';

export interface GitLabError extends AxiosResponse {
    generalMessage: string;
    message: string;
}