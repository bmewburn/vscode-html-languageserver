import { ResponseError, CancellationToken } from 'vscode-languageserver';
export declare function formatError(message: string, err: any): string;
export declare function runSafeAsync<T>(func: () => Thenable<T>, errorVal: T, errorMessage: string, token: CancellationToken): Thenable<T | ResponseError<any>>;
export declare function runSafe<T, E>(func: () => T, errorVal: T, errorMessage: string, token: CancellationToken): Thenable<T | ResponseError<E>>;
