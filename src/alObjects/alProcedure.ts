export class AlProcedure {
    public readonly name: string;
    public readonly procedureBlock: string;
    public readonly parameters: string[] = [];
    public readonly returnType: string;

    public constructor(name: string, procedureBlock: string, parameters: string[], returnType: string) {
        this.name = name;
        this.procedureBlock = procedureBlock;
        this.parameters = parameters;
        this.returnType = returnType;
    }

    public toString(): string {
        return `procedure ${this.name}(${this.parameters.join('; ')}): ${this.returnType}\n\tbegin\n\t\t_${this.procedureBlock}\n\tend;`;
    }
}

export class AlProcedureBuilder {
    private name: string | undefined;
    private procedureBlock: string | undefined;
    private parameters: string[] = [];
    private returnType: string | undefined;

    public withName(name: string): AlProcedureBuilder {
        this.name = name;
        return this;
    }

    public withProcedureBlock(procedureBlock: string): AlProcedureBuilder {
        this.procedureBlock = procedureBlock;
        return this;
    }

    public withParameters(parameters: string[]): AlProcedureBuilder {
        this.parameters = parameters;
        return this;
    }

    public withReturnType(returnType: string): AlProcedureBuilder {
        this.returnType = returnType;
        return this;
    }

    public build(): AlProcedure {
        if (!this.name || !this.procedureBlock || !this.returnType) {
            throw new Error('Name, procedureBlock and returnType are required to build an AlProcedure');
        }
        return new AlProcedure(this.name, this.procedureBlock, this.parameters, this.returnType);
    }
}