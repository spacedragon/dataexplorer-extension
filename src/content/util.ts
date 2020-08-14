import { all_editors } from "./init";

export async function newQueryInTab(query: string) {
    newTab();
    await delay(100);
    if(addQuery(query)) {
        await delay(100)
        clickRun();
    };
}

export function addQuery(query: string, select: boolean = true) {
    const monacoEl = document.querySelector(".monaco-editor");
    if (monacoEl) {
        const dataUri = monacoEl.getAttribute("data-uri");
        const model = monaco.editor.getModel(monaco.Uri.parse(dataUri));
        if (model) {
            const oldValue = model.getValue();
            const newValue = oldValue + "\n" + query;
            model.setValue(newValue);
            if (select) {
                const startIndex = oldValue.length + 1;
                const endIndex = newValue.length;
                const start = model.getPositionAt(startIndex);
                const end = model.getPositionAt(endIndex);
                const editor = findEditorByModel(model);
                if (editor) {
                    editor.setSelection(new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column));
                }
            }
            return true;
        }
    }
    return false;
}

export function newTab() {
    const newTabButton: HTMLButtonElement = document.querySelector("button[aria-label='Add new tab']");
    if (newTabButton) {
        newTabButton.click()
    }
}

export function clickRun() {
    const btn: HTMLButtonElement = document.querySelector("button[name='Run']");
    if (btn) {
        btn.click()
    }
}

export async function delay(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()                
        }, ms);
    });
}

export interface Match {
    start: number,
    end: number,
    match: RegExpExecArray
}

export function tester(regex: RegExp, str: string): Match[] {
    const results = [];
    if (str) {
        const re = new RegExp(regex, 'gim');
        let m: RegExpExecArray;
        while ((m = re.exec(str)) !== null) {
            const requestId = m[1];
            const start = m.index;
            const end = start + m[0].length; 
            results.push({ start, end,  match: m });
          }
    }
    return results;
}

export function findEditorByModel(model: monaco.editor.IModel) {
    const editor = all_editors.find(ed => ed.getModel().id === model.id);
    return editor
}