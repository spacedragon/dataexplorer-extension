import { ICommand } from "../rule";
import { newQueryInTab, tester, Match, addQuery } from "../util";

const regex = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])(T|\s)(2[0-3]|[01][0-9]):([0-5][0-9])(:[0-5][0-9]Z)?/;

 

export class AddTimestampToQuery implements ICommand<Match[]> {
    test(line: string) {
        const matches =  tester(regex, line)
        return matches.length >0 ? matches : undefined;
    };

    public get id() {
        return "add_timestamp_to_query";
    }
    public get title() {
        return "Add timestamp to query";
    }

    handler(editor: monaco.editor.IStandaloneCodeEditor, matches: Match[]): void {
        const m = matches[0];
        if(m) {
            const timestamp = m.match[0];
            const query = `
let timestamp = todatetime("${timestamp}");
let duration = totimespan(5m);

// add this to your query
| where TIMESTAMP between((timestamp-duration) .. (timestamp+duration) )`;
            addQuery(query)
        }
   }
}

 

 

export const commands = [new AddTimestampToQuery()];