import {ILoggerStrategy} from "../../common/interfaces/strategy";

export class ConsoleLogStrategy implements ILoggerStrategy{
    async log(buffer: string){
        console.log(buffer);
    }
}