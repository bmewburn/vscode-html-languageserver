import { InitializeParams, InitializeResult, ConfigurationParams, ColorInformation } from 'vscode-languageserver/node';
import { CancellationToken, PublishDiagnosticsParams, TextDocumentContentChangeEvent } from 'vscode-languageserver-protocol/node';
import { DocumentLink, SymbolInformation, CompletionItem, Position, Range, TextDocumentIdentifier, VersionedTextDocumentIdentifier, TextDocumentItem, FormattingOptions, Color } from 'vscode-languageserver-types';
import { Settings } from './modes/languageModes';
export declare namespace HtmlCssJsService {
    function initialise(params: InitializeParams): InitializeResult;
    function shutdown(): void;
    function openDocument(textDocumentItem: TextDocumentItem): void;
    function closeDocument(textDocumentIdentifier: TextDocumentIdentifier): void;
    function changeDocument(textDocumentIdentifier: VersionedTextDocumentIdentifier, changes: TextDocumentContentChangeEvent[]): void;
    function setConfig(config: any): void;
    function diagnose(textDocumentIdentifier: TextDocumentIdentifier): Promise<PublishDiagnosticsParams>;
    function provideCompletions(textDocumentIdentifier: TextDocumentIdentifier, position: Position, token: CancellationToken): Thenable<import("vscode-languageserver-types").CompletionList | import("vscode-languageserver/node").ResponseError<any> | null>;
    function completionItemResolve(item: CompletionItem, token: CancellationToken): Thenable<CompletionItem | import("vscode-languageserver/node").ResponseError<any>>;
    function provideHover(textDocumentIdentifier: TextDocumentIdentifier, position: Position, token: CancellationToken): Thenable<import("vscode-languageserver-types").Hover | import("vscode-languageserver/node").ResponseError<any> | null>;
    function provideDocumentHighlight(textDocumentIdentifier: TextDocumentIdentifier, position: Position, token: CancellationToken): Thenable<import("vscode-languageserver-types").DocumentHighlight[] | import("vscode-languageserver/node").ResponseError<any>>;
    function onDefinition(textDocumentIdentifier: TextDocumentIdentifier, position: Position, token: CancellationToken): Thenable<import("vscode-languageserver-types").Location | import("vscode-languageserver-types").Location[] | import("vscode-languageserver/node").ResponseError<any> | null>;
    function provideReferences(textDocumentIdentifier: TextDocumentIdentifier, position: Position, token: CancellationToken): Thenable<import("vscode-languageserver-types").Location[] | import("vscode-languageserver/node").ResponseError<any>>;
    function provideSignatureHelp(textDocumentIdentifier: TextDocumentIdentifier, position: Position, token: CancellationToken): Thenable<import("vscode-languageserver-types").SignatureHelp | import("vscode-languageserver/node").ResponseError<any> | null>;
    function provideDocumentRangeFormattingEdits(textDocumentIdentifier: TextDocumentIdentifier, range: Range, options: FormattingOptions, token: CancellationToken): Thenable<import("vscode-languageserver-types").TextEdit[] | import("vscode-languageserver/node").ResponseError<any>>;
    function provideDocumentLinks(textDocumentIdentifier: TextDocumentIdentifier, token: CancellationToken): Thenable<DocumentLink[] | import("vscode-languageserver/node").ResponseError<any>>;
    function provideDocumentSymbols(textDocumentIdentifier: TextDocumentIdentifier, token: CancellationToken): Thenable<SymbolInformation[] | import("vscode-languageserver/node").ResponseError<any>>;
    function provideFoldingRanges(textDocumentIdentifier: TextDocumentIdentifier, token: CancellationToken): Thenable<import("vscode-languageserver-types").FoldingRange[] | import("vscode-languageserver/node").ResponseError<any> | null>;
    function provideSelectionRanges(textDocumentIdentifier: TextDocumentIdentifier, positions: Position[], token: CancellationToken): Thenable<import("vscode-languageserver-types").SelectionRange[] | import("vscode-languageserver/node").ResponseError<any>>;
    function provideDocumentColours(textDocumentIdentifier: TextDocumentIdentifier, token: CancellationToken): Thenable<import("vscode-languageserver/node").ResponseError<any> | ColorInformation[]>;
    function provideColorPresentations(textDocumentIdentifier: TextDocumentIdentifier, range: Range, color: Color, token: CancellationToken): Thenable<import("vscode-languageserver/node").ResponseError<any> | import("vscode-languageserver-types").ColorPresentation[]>;
    function provideTagClose(textDocumentIdentifier: TextDocumentIdentifier, position: Position, token: CancellationToken): Thenable<string | import("vscode-languageserver/node").ResponseError<any> | null>;
    var requestConfigurationDelegate: (params: ConfigurationParams) => Thenable<Settings>;
}
