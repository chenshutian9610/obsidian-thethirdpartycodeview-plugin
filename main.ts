import {
  WorkspaceLeaf,
  Plugin,
  TextFileView,
  MarkdownRenderer,
} from "obsidian";

const VIEW_TYPE_THE_THIRD_PARTY_CODE = "the-third-party-code-view";
const EXT_TYPE_THE_THIRD_PARTY_CODE = [
  "txt",
  "http",
  "conf",
  "uml",
  "java",
  "cpp",
  "c",
  "cc",
  "h",
  "hpp",
  "cs",
  "vb",
  "fs",
  "py",
  "pl",
  "pm",
  "rb",
  "js",
  "ts",
  "html",
  "css",
  "php",
  "phtml",
  "aspx",
  "asax",
  "asm",
  "sh",
  "bat",
  "ps1",
  "sql",
  "xml",
  "json",
  "yml",
  "yaml",
  "toml",
  "ini",
  "properties",
  "go",
  "scala",
  "kt",
  "dart",
  "swift",
  "objc",
  "javafx",
  "lua",
  "r",
  "rs",
  "erl",
  "ex",
  "clj",
  "cljs",
  "jl",
  "sass",
  "less",
  "styl",
  "pug",
  "ejs",
  "mustache",
  "handlebars",
  "hbs",
  "twig",
  "coffee",
  "elm",
  "nim",
  "groovy",
  "vbscript",
  "vbs",
  "awk",
  "tex",
  "hx",
  "ml",
  "re",
  "ml",
  "m",
  "idr",
  "lidr",
  "v",
  "sv",
  "tcl",
  "liquid",
];

export default class TheThirdPartyCodeViewPlugin extends Plugin {
  async onload() {
    // 注册视图
    this.registerView(
      VIEW_TYPE_THE_THIRD_PARTY_CODE,
      (leaf) => new TheThirdPartyCodeView(leaf)
    );
    // 扩展名关联视图
    this.registerExtensions(
      EXT_TYPE_THE_THIRD_PARTY_CODE,
      VIEW_TYPE_THE_THIRD_PARTY_CODE
    );
  }

  async onunload() {}
}

class TheThirdPartyCodeView extends TextFileView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE_THE_THIRD_PARTY_CODE;
  }

  /** 获取文件标题 */
  getDisplayText() {
    return this.file?.name + " (readonly)";
  }

  /** 获取文件内容，用于回写到原文件 */
  getViewData(): string {
    return this.data;
  }

  /** 渲染 */
  setViewData(data: string, clear: boolean): void {
    // 超过 100KB 的不渲染，会卡死
    if (this.data.length > 100 * 1024) {
      this.renderTextFormat();
    } else {
      this.renderMarkdownFormat();
    }
    // 调试代码
    global.exampleview = this;
    global.MarkdownRenderer = MarkdownRenderer;
  }

  /** 文本格式 */
  renderTextFormat() {
    console.log("renderTextFormat", this.file?.name);
    const container = this?.containerEl?.children[1];
    container.empty();
    container.createEl("pre", { text: this.data });
  }

  /** markdown 格式 */
  renderMarkdownFormat() {
    console.log("renderMarkdownFormat", this.file?.name);
    const container = this?.containerEl?.children[1];
    container.empty();
    MarkdownRenderer.render(
      this.app,
      "```" + this.file?.extension + "\n" + this.data + "\n```",
      container,
      this?.file?.path,
      this
    ).catch((reason) => {
      this.renderTextFormat();
      console.error("renderMarkdown", reason);
    });
  }

  clear(): void {
    console.warn("clear");
  }
}
