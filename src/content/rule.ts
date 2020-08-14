export type TestFunction<T> = (line: string) => T | undefined

export interface ICommand<T> {
    id: string,
    title: string
    test: TestFunction<T>,
    handler(editor: monaco.editor.IStandaloneCodeEditor, arg?: T): void
}