##  Webview

> Webview in  extension 

## Change project template

You can use another ice template in directory `web`.

### 1. Create webview project in dir web

![demo](https://user-images.githubusercontent.com/56879942/88181928-1e927f00-cc62-11ea-94fb-06d12dab77d1.gif)

1. Open vscode command palette  through `Ctrl+Shift+P` or `⇧⌘P`.
2. Enter `AppWorks: create Application` to activate the extension.

### 2. Update build.json config

Update publicPath and outputDir.

```json
// build.json
{
  "publicPath": "./",
  "outputDir": "../build"
}

```

## Debug

`npm run start` and see mock dir files for AppWorks service debug.
