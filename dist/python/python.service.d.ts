export declare class PythonService {
    private readonly logger;
    executePythonScript(script: string, args: any): Promise<any>;
    private extractJson;
}
