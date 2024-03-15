import axios, {AxiosInstance, AxiosRequestConfig, AxiosError, CreateAxiosDefaults} from 'axios';
import { IHttpClient } from "../common/interfaces/http-client";
import "dotenv/config.js";
import {config} from "./config";

class HttpClient implements IHttpClient {
    private readonly axios: AxiosInstance;
    constructor() {
        const baseURL = config.get<string>('BASE_URL');
        if(!baseURL){
            throw new Error('Необходимо указать ссылку на api gitlab в файл .env')
        }
        const token = config.get<string>('TOKEN');
        if(!token){
            throw new Error('Необходимо указать access token в файл .env')
        }
        this.axios = axios.create({
            baseURL,
            headers: {'PRIVATE-TOKEN': token,}
        } as CreateAxiosDefaults)
    }

    async get<T>(url: string, config?: AxiosRequestConfig){
        try {
            const { data } = await this.axios.get<T>(url, config);
            return data;
        } catch (e) {
            throw e;
        }
    }

    async post<T>(url: string, params: any = {}, config?: AxiosRequestConfig){
        try {
            const { data } = await this.axios.post<T>(url, params, config);
            return data;
        } catch(e) {
          throw e;
        }
    }

    async delete<T>(url: string){
        try {
            const { data } = await this.axios.delete<T>(url);
            return data;
        } catch(e) {
            throw e;
        }
    }

    private handleError(e: AxiosError){
        // console.warn('Ошибка: ', e.response.data);
        return e.response;
    }
}

export const httpClient = new HttpClient();