import { Application, Context } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((ctx: Context) => {
  ctx.response.body = "Hello World!";
});

import { FreeWebView } from "./webview/webview-main.ts";
const test = new FreeWebView({
  title: "Local webview_deno example",
  url: `http://127.0.0.1:8000/`,
  height: 600,
  resizable: true,
  debug: false,
  frameless: false,
})

app.listen({ port: 8000 });

await test.statusPromise(FreeWebView.webviewStatus.closing);