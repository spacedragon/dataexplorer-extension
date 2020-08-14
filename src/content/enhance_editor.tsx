import { commands as  mmsCommands } from "./mms"
export function enhanceEditor(editor: monaco.editor.IStandaloneCodeEditor) {
    editor.updateOptions({
        hover: {
            enabled: true,
            sticky: true
        },
        codeLens: true,
        lineNumbers: "off"
    })
    const commandService = editor['_commandService'];
    
    editor.onMouseDown(event => {
        const el = event.target;
        if (el && el.element) {
            if (el.element.className.includes("qu")) {

            }
        }
    })

    mmsCommands.forEach(r => {
        const cmd = {
            id: r.id,
            handler: (...args) => {
                console.log(args)
                r.handler(editor, args[1])
            }
        }
        commandService.addCommand(cmd);
    })

    monaco.languages.registerCodeLensProvider('json', {
        provideCodeLenses: function (model, token) {
            const codelens = [];
            const selection = editor.getSelection();
            if (selection && !selection.isEmpty){
                codelens.push({
                    range: {
                        startLineNumber: selection.startLineNumber,
                        startColumn: selection.startColumn,
                        endLineNumber: selection.endLineNumber,
                        endColumn: selection.endColumn
                    },
                    id: "test",
                    command: {
                        id: "test",
                        title: "Search in MMS",
                    }
                })
            }
            return codelens;
        },
        resolveCodeLens: function (model, codeLens, token) {
            return codeLens;
        },
    });
}