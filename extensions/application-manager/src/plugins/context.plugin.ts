import { ExtensionContext } from 'vscode';

export class Context {
    static context: ExtensionContext;
    static set(ctx: ExtensionContext) {
      this.context = ctx;
    }
    static get(): ExtensionContext {
      return this.context;
    }
}
