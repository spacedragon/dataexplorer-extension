import { ICommand } from "../rule";
import { newQueryInTab, tester, Match } from "../util";

const regex = /operation\s*(?:id|_id)"?\s*:\s*"?([a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12})/;

 

export class QueryDependsByOpId implements ICommand<Match[]> {
    test(line: string) {
        const matches =  tester(regex, line)
        return matches.length >0 ? matches : undefined;
    };

    public get id() {
        return "deps_query_by_op_id";
    }
    public get title() {
        return "Query Dependencies";
    }

    handler(editor: monaco.editor.IStandaloneCodeEditor, matches: Match[]): void {
        if (matches.length > 0) {
            const opId = matches[0].match[1];
            const query = `UnionOfAllLogs("Vienna", "dependencies") | where operation_Id == "${opId}" \n| project TIMESTAMP, app, data, target, resultCode, type, duration, name, customDimensions`
            newQueryInTab(query);  
        }
   }
}

export class QueryTracesByOpId implements ICommand<Match[]> {
    test(line: string) {
        const matches =  tester(regex, line)
        return matches.length >0 ? matches : undefined;
    };

    public get id() {
        return "traces_query_by_op_id";
    }
    public get title() {
        return "Query Traces";
    }

    handler(editor: monaco.editor.IStandaloneCodeEditor, matches: Match[]): void {
        if (matches.length > 0) {
            const opId = matches[0].match[1];
            const query = `UnionOfAllLogs("Vienna", "traces") | where operation_Id == "${opId}" \n`
            newQueryInTab(query);  
        }
   }
}


 

export const commands = [new QueryDependsByOpId(), new QueryTracesByOpId()];