import fs from "fs/promises";
import {constants} from "fs";

export class FileProvider {
    private readonly filename: string;
    constructor(filename: string) {
        this.filename = `./${filename}`;
    }

    async readJson<T>(){
        try {
            const text = await fs.readFile(this.filename, {
                encoding: 'utf-8',
            });
            return JSON.parse(text.toString()) as T;
        } catch {
            throw new Error(`Ошибка чтения из файла ${this.filename}`);
        }

    }

    async write(buffer: string){
        try {
            await fs.access(this.filename, constants.F_OK);
            const filehandle = await fs.open(this.filename, 'r+');
            const text = await this.read()
            await this.writeIfExist(text +  buffer);
            await filehandle.close();
        } catch {
            const filehandle = await this.create();
            await this.writeIfExist(buffer);
            await filehandle.close();
        }
    }

    private async read(){
        return await fs.readFile(this.filename, {
            encoding: 'utf-8',
        });
    }

    private async writeIfExist(data: string){
        return await fs.writeFile(this.filename, data, {
            flag: 'w+'
        });
    }

    private async create(){
        return await fs.open(`./${this.filename}`, 'w');
    }
}