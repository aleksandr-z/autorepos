import {IStrategy} from "../common/interfaces/strategy";

export class Controller {
    private readonly strategy: IStrategy;
    constructor(strategy: IStrategy) {
        this.strategy = strategy;
    }

    async start(){
        await this.strategy.runProcess();
    }
}