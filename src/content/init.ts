
import { enhanceEditor } from "./enhance_editor"
import { commands as mmsCommands, MMSLinkProvider } from "./mms";
import { SubscriptionHoverProvider } from "./mms/subscription_helper";
declare global {
    interface Window {
        monaco: typeof monaco
    }
}

function start_check() {
    setTimeout(() => {
        if (window.monaco) {
            init()
        } else {
            start_check()
        }
    }, 1)
}

const all_editors: monaco.editor.IStandaloneCodeEditor[]  = [];

function init() {
    monaco.editor.onDidCreateEditor((editor: monaco.editor.IStandaloneCodeEditor) => {
        all_editors.push(editor)
        enhanceEditor(editor as monaco.editor.IStandaloneCodeEditor)
        editor.onDidDispose(() => {
            const delIndx = all_editors.indexOf(editor);
            if (delIndx >=0) {
                all_editors.splice(delIndx, 1)
            }
        })
    })
   
    monaco.languages.registerCodeLensProvider('json', {
        provideCodeLenses: function (model, token) {
            const value = model.getValue();
            if (value) {
                const codelens = [];
                const lines = value.split("\n");
                lines.forEach((line, idx) => {
                    for (const command of mmsCommands) {
                        const m = command.test(line);
                        if (m) {
                            let startColumn = 1
                            let endColumn = 1
                            if (Array.isArray(m))  {
                                startColumn = m[0].start || 1;
                                endColumn = m[0].end || 1;
                            }
                            codelens.push({
                                range: {
                                    startLineNumber: idx+1,
                                    startColumn,
                                    endLineNumber: idx+1,
                                    endColumn
                                },
                                id: command.id,
                                command: {
                                    id: command.id,
                                    title: command.title,
                                    arguments: [m , line],
                                  
                                },
                            })
                        }
                    }
                });
                return codelens;
            } else {
                return [];
            }
        },
        resolveCodeLens: function (model, codeLens, token) {   
            return codeLens;
        },
    });
    monaco.languages.registerHoverProvider('json', SubscriptionHoverProvider);

    monaco.languages.registerLinkProvider('json', MMSLinkProvider);
}


start_check()


export { all_editors }