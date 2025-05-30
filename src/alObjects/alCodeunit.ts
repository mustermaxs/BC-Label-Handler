import { AlProcedure } from "./alProcedure";

export class AlCodeunit {
    public readonly id: number;
    public readonly name: string;
    public readonly variables: string[] = [];
    public readonly procedures: AlProcedure[] = [];

    public constructor(id: number, name: string, variables: string[], procedures: AlProcedure[]) {
        this.id = id;
        this.name = name;
        this.variables = variables;
        this.procedures = procedures;
    }

    public toString(): string {
        let proceduresStringified = this.procedures.map(procedure => procedure.toString()).join('\n\n\t');
        let variablesStringified = this.variables.join('\n\t\t');
        return `codeunit ${this.id} ${this.name}\n{\n\t${this.variables.length > 0 ? '\n\tvar' : ''}\n\t\t${variablesStringified}\n\n\t${proceduresStringified}\n}`;
    }
}

export class AlCodeunitBuilder {
    private id: number | undefined;
    private name: string | undefined;
    private variables: string[] = [];
    private procedures: AlProcedure[] = [];

    public withId(id: number): AlCodeunitBuilder {
        this.id = id;
        return this;
    }

    public withName(name: string): AlCodeunitBuilder {
        this.name = name;
        return this;
    }

    public withVariables(variables: string[]): AlCodeunitBuilder {
        this.variables = variables;
        return this;
    }

    public withProcedures(procedures: AlProcedure[]): AlCodeunitBuilder {
        this.procedures = procedures;
        return this;
    }

    public build(): AlCodeunit {
        if (!this.id || !this.name) {
            throw new Error('Id and name are required to build an AlCodeunit');
        }
        return new AlCodeunit(this.id, this.name, this.variables, this.procedures);
    }
}