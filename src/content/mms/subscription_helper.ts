import { ICommand } from "../rule";
import { newQueryInTab } from "../util";
import { executeQuery } from "../query";


const sub_regex = /subscription\s*(?:id|_id)?"?\s*:\s*"?([a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12})/;

interface SubMatch {
    start: number,
    end: number,
    subId: string
}

export function subscription_tester(str: string): SubMatch[] {
    const results = [];
    if (str) {
        const re = new RegExp(sub_regex, 'gim');
        let m;
        while ((m = re.exec(str)) !== null) {
            const subId = m[1];
            const start = m.index;
            const end = start + m[0].length; 
            results.push({ start, end,  subId });
          }
    }
    return results;
}




export class SubscriptionInfo implements ICommand<SubMatch[]> {
    test(line: string) {
        const matches =  subscription_tester(line)
        return matches.length >0 ? matches : undefined;
    };

    public get id() {
        return "get_subscription_info";
    }
    public get title() {
        return "Query Subscription";
    }

    handler(editor: monaco.editor.IStandaloneCodeEditor, matches: SubMatch[]): void {
         if (matches.length > 0) {
             const subId = matches[0].subId;
             const query = `ViennaAllTenantsSubscriptions\n| where SubscriptionId  == "${subId}"`
             newQueryInTab(query);  
         }
    }
}

 
export const SubscriptionHoverProvider: monaco.languages.HoverProvider = {
    provideHover: async function (model, position) {
        const offset = model.getOffsetAt(position);
        const minStart = Math.max(offset - 53, 0);
        const maxEnd = Math.min(offset + 53, model.getValueLength());
        const start = model.getPositionAt(minStart);
        const end = model.getPositionAt(maxEnd);
        const value = model.getValueInRange(new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column));
        const testResults = subscription_tester(value);
        if (testResults.length > 0) {
            for (const t of testResults) {
                const query = `ViennaAllTenantsSubscriptions\n| where SubscriptionId  == "${t.subId}"`;
                if ((offset - minStart > t.start) && (offset - minStart) < t.end) {
                    const rangeStart = model.getPositionAt(minStart + t.start);
                    const rangeEnd = model.getPositionAt(minStart + t.end);
                    const results = await executeQuery('viennause2', 'Vienna',query);
                    if (results.length > 0) {
                        const result = results[0];
                        return {
                            range: new monaco.Range(rangeStart.lineNumber, rangeStart.column, rangeEnd.lineNumber, rangeEnd.column),
                            contents: [
                                { value: `**Id**: ${result['SubscriptionId']}` },
                                { value: `**Name**: ${result['SubscriptionName']}` },
                                { value: `**Customer**: ${result['CustomerName']}` },
                                { value: `**Customer GUID**: ${result['CustomerGUID']}` },
                                { value: `**Type**: ${result['SubscriptionType']}` },
                                { value: `**Organization**: ${result['OrganizationName']}` },
                                { value: `**Service Group**: ${result['ServiceGroupName']}` }
                            ]
                        };
                    }
                }
            }
        }
        return undefined;
    }
};


export const commands = [new SubscriptionInfo()];