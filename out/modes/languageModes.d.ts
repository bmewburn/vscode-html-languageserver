import { ClientCapabilities, DocumentContext, IHTMLDataProvider, SelectionRange } from 'vscode-html-languageservice';
import { Color, ColorInformation, ColorPresentation, WorkspaceFolder } from 'vscode-languageserver';
import { CompletionItem, CompletionList, Definition, Diagnostic, DocumentHighlight, DocumentLink, FoldingRange, FormattingOptions, Hover, Location, Position, Range, SignatureHelp, SymbolInformation, TextDocument, TextEdit } from 'vscode-languageserver-types';
export { ColorInformation, ColorPresentation, Color };
export interface Settings {
    css?: any;
    html?: any;
    javascript?: any;
}
export interface Workspace {
    readonly settings: Settings;
    readonly folders: WorkspaceFolder[];
}
export interface LanguageMode {
    getId(): string;
    getSelectionRanges?: (document: TextDocument, positions: Position[]) => SelectionRange[];
    doValidation?: (document: TextDocument, settings?: Settings) => Diagnostic[];
    doComplete?: (document: TextDocument, position: Position, settings?: Settings) => CompletionList;
    doResolve?: (document: TextDocument, item: CompletionItem) => CompletionItem;
    doHover?: (document: TextDocument, position: Position) => Hover | null;
    doSignatureHelp?: (document: TextDocument, position: Position) => SignatureHelp | null;
    findDocumentHighlight?: (document: TextDocument, position: Position) => DocumentHighlight[];
    findDocumentSymbols?: (document: TextDocument) => SymbolInformation[];
    findDocumentLinks?: (document: TextDocument, documentContext: DocumentContext) => DocumentLink[];
    findDefinition?: (document: TextDocument, position: Position) => Definition | null;
    findReferences?: (document: TextDocument, position: Position) => Location[];
    format?: (document: TextDocument, range: Range, options: FormattingOptions, settings?: Settings) => TextEdit[];
    findDocumentColors?: (document: TextDocument) => ColorInformation[];
    getColorPresentations?: (document: TextDocument, color: Color, range: Range) => ColorPresentation[];
    doAutoClose?: (document: TextDocument, position: Position) => string | null;
    getFoldingRanges?: (document: TextDocument) => FoldingRange[];
    onDocumentRemoved(document: TextDocument): void;
    dispose(): void;
}
export interface LanguageModes {
    getModeAtPosition(document: TextDocument, position: Position): LanguageMode | undefined;
    getModesInRange(document: TextDocument, range: Range): LanguageModeRange[];
    getAllModes(): LanguageMode[];
    getAllModesInDocument(document: TextDocument): LanguageMode[];
    getMode(languageId: string): LanguageMode | undefined;
    onDocumentRemoved(document: TextDocument): void;
    dispose(): void;
}
export interface LanguageModeRange extends Range {
    mode: LanguageMode | undefined;
    attributeValue?: boolean;
}
export declare function getLanguageModes(supportedLanguages: {
    [languageId: string]: boolean;
}, workspace: Workspace, clientCapabilities: ClientCapabilities, customDataProviders?: IHTMLDataProvider[]): LanguageModes;
