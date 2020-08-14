import { ICommand } from "../rule";
import { newQueryInTab, tester, Match } from "../util";

const regex = /request\s*(?:id|_id|-id)"?\s*:\s*"?([a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12})/;

 

export class QueryMMSLogByRequestId implements ICommand<Match[]> {
    test(line: string) {
        const matches =  tester(regex, line)
        return matches.length >0 ? matches : undefined;
    };

    public get id() {
        return "mms_query_by_request_di";
    }
    public get title() {
        return "Query MMS Logs";
    }

    handler(editor: monaco.editor.IStandaloneCodeEditor, matches: Match[]): void {
        if (matches.length > 0) {
            const requestId = matches[0].match[1];
            const query = `All_ModelManagementLogs\n| where RequestId == "${requestId}" \n` +
            "| project PreciseTimeStamp, Level, SourceName, Message, SubscriptionId, RequestId";
            newQueryInTab(query);  
        }
   }
}


export class QueryMMSApiByRequestId implements ICommand<Match[]> {
    test(line: string) {
        const matches =  tester(regex, line)
        return matches.length >0 ? matches : undefined;
    };

    public get id() {
        return "mms_query_by_request_di";
    }
    public get title() {
        return "Query MMS Api";
    }

    handler(editor: monaco.editor.IStandaloneCodeEditor, matches: Match[]): void {
        if (matches.length > 0) {
            const requestId = matches[0].match[1];
            const query = `All_ModelManagementApiTelemetry\n| where RequestId == "${requestId}" \n`;
            newQueryInTab(query);  
        }
   }
}

export class QueryRequestsByRequestId implements ICommand<Match[]> {
    test(line: string) {
        const matches =  tester(regex, line)
        return matches.length >0 ? matches : undefined;
    };

    public get id() {
        return "requests_query_by_request_di";
    }
    public get title() {
        return "Query requests";
    }

    handler(editor: monaco.editor.IStandaloneCodeEditor, matches: Match[]): void {
        if (matches.length > 0) {
            const requestId = matches[0].match[1];
            const query = `UnionOfAllLogs("Vienna", "requests") \n| where todynamic(customDimensions)["x-ms-client-request-id"] == "${requestId}"`+
            `\n| project name, app, resultCode, timestamp, operation_Id`​;
            newQueryInTab(query);  
        }
   }
}

export const QueryMMS = new QueryMMSLogByRequestId();
export const QueryRequests = new QueryRequestsByRequestId();

const QueryMMSApi = new QueryMMSApiByRequestId();
export const commands = [QueryMMS, QueryRequests, QueryMMSApi];