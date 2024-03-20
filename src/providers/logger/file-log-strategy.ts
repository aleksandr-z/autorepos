import {ILoggerStrategy} from "../../common/interfaces/strategy";
import {FileProvider} from "../file";

export class FileLogStrategy implements ILoggerStrategy{
    private fileProvider: FileProvider;
    constructor() {
        const date = new Date().toISOString().replace(/[\.:]/g, '_');
        this.fileProvider = new FileProvider(`log_${date}.txt`);
    }

    async log(buffer: string){
        await this.fileProvider.write(buffer  + '\n');
    }
}