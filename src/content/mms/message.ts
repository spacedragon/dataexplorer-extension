import { ICommand } from "../rule";
import "../content.scss"
const MESSAGE_HEADER = "\"Message\": ";


const JSON_RE = /\{((\".*\")\s*:(.*),?)*\}/gm;

export class FormatMessage implements ICommand<boolean> {
    test(line: string) {
        return line.trim().startsWith("\"Message\": ")
    };

    public get id() {
        return "mms_format_message";
    }
    public get title() {
        return "Format Message";
    }

    handler(editor: monaco.editor.IStandaloneCodeEditor): void {
        const value = editor.getModel().getValue();
        if (value) {
            const lines = value.split("\n");
            for (let index = 0; index < lines.length; index++) {
                const line = lines[index];
                if (this.test(line)) {
                    const content = line.trim().slice(MESSAGE_HEADER.length)
                    const formatted = this.format(content);
                    lines[index] = MESSAGE_HEADER + "\n\t" + formatted;
                    break;
                }
            }
            const newValue = lines.join("\n")
            const jsonFormatted = this.formatJson(newValue);
            editor.getModel().setValue(jsonFormatted);
            this.highlight(editor);
        }
    }
    highlight(editor: monaco.editor.IStandaloneCodeEditor) {
        const value = editor.getModel().getValue();
        const lines = value.split("\n");
        const decorations: monaco.editor.IModelDeltaDecoration[] = [];
        for (let index = 0; index < lines.length; index++) {
            const qualifiedNamePattern = RegExp(/at\s([a-zA-Z\.0-9_]*)/, "g");
            const line = lines[index];
            const match = qualifiedNamePattern.exec(line);
            if (match) {
                const end = qualifiedNamePattern.lastIndex;
                const qn = match[1]
                const start = end - qn.length;
                decorations.push({
                    range: new monaco.Range(index + 1, start + 1, index + 1, end + 1),
                    options: { inlineClassName: 'qualifiedName', className: `qn_${qn}`  }
                })
            }
        }

        editor.deltaDecorations([], decorations);
    }
    format(content: string) {
        const pattern = /\s+at\s/g;
        const result = content.replace(pattern, "\n\tat ");
        return result;
    }
    formatJson(content: string) {
        const re = new RegExp(JSON_RE, 'gm');
        return content.replace(re, (m) => {
            try {
                const obj = JSON.parse(m)
                return JSON.stringify(obj, null, 4)
            } catch (error) {
                return m
            }
        })
    }
}


export class SearchMessage implements ICommand<boolean> {
    test(line: string) {
        return line.trim().startsWith("\"Message\":")
    };

    public get id() {
        return "mms_search_message";
    }
    public get title() {
        return "Search Selection";
    }

    handler(editor: monaco.editor.IStandaloneCodeEditor): void {
        
        const selection = editor.getSelection();
        if (!selection.isEmpty()) {
            const q = editor.getModel().getValueInRange(new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn));
            if (q && q.length > 0) {
                const url = `https://msdata.visualstudio.com/Vienna/_search?text=${encodeURIComponent(q)}&type=code&lp=code-Project&filters=ProjectFilters%7BVienna%7DRepositoryFilters%7Bmodel-management%7D&pageSize=25`
                window.open( url, "_blank");
             }
        }
    }
}
 


export const commands = [new FormatMessage(), new SearchMessage()]