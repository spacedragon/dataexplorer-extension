import { tester } from "../util";

const LINK_RE = /in\s.*(\/src.*):line\s(\d+)/g

export const MMSLinkProvider: monaco.languages.LinkProvider = {
    provideLinks(model: monaco.editor.ITextModel, token): monaco.languages.ILink[] {
        const source = model.getValue();
        const matches = tester(LINK_RE, source);
        return matches.map(m => {
            const {start, end, match} = m
            const startPos = model.getPositionAt(start)
            const endPos = model.getPositionAt(end)
            const path = match[1];
            const line = parseInt(match[2]);
            return {
                range: new monaco.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column),
                url: `https://msdata.visualstudio.com/Vienna/_git/model-management?path=${encodeURIComponent(path)}&version=GBmaster&line=${line}&lineEnd=${line + 1}&lineStartColumn=1&lineEndColumn=1`
            }
        })
    },

}