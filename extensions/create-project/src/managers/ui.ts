import * as vscode from "vscode";

import { showError, showMessage } from "../utils/common";

// import SSO from "../utils/sso";

export default class UI {
  private static instance?: UI;

  renderLoginForm() {
    vscode.window
      .showInputBox({
        title: "请输入用户名（邮箱前缀）",
      })
      .then((userName) => {
        if (userName) {
          vscode.window
            .showInputBox({
              title: "请输入邮箱密码",
              password: true,
            })
            .then((password) => {
              if (password) {
                vscode.window
                  .withProgress(
                    {
                      title: `使用用户名 ${userName} 登陆中～`,
                      location: vscode.ProgressLocation.Notification,
                    },
                    () => {
                      // return SSO.getInstance().login(userName, password);
                    }
                  )
                  .then(
                    () => {
                      showMessage("登陆成功！");
                    },
                    () => {
                      showError("登陆失败，请检查用户名和密码是否输入正确");
                    }
                  );
              }
            });
        }
      });
  }

  renderBranchNoteInputBox(branchName: string) {
    return vscode.window
      .showInputBox({
        title: "请输入分支备注(英文)",
        placeHolder: "分支备注(可选)",
        prompt: `预期创建分支：${branchName}，如填写分支备注，分支名将创建为：${branchName}_分支备注`,
      })
      .then((res) => (res ? branchName + "_" + res : branchName));
  }

  static getInstance() {
    if (!UI.instance) {
      UI.instance = new UI();
    }

    return UI.instance;
  }
}
