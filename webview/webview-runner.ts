import { webviewStatus } from "./status-enums.ts";

declare function postMessage(data: any, transfer?: any[]): void;
declare var onmessage: (data: any, transfer?: any[]) => void;

import { WebView } from "https://deno.land/x/webview@0.4.7/mod.ts";
import { unload } from "https://deno.land/x/webview@0.4.7/plugin.ts";

let webview: WebView | null;

onmessage = async (event) => {
  if (event.data) {
    postMessage(webviewStatus.starting);
    webview = new WebView(event.data);
    postMessage(webviewStatus.running);
    await webview.run();
    postMessage(webviewStatus.closing);
    webview.exit();
    webview = null;
    postMessage(webviewStatus.unloading);
    console.debug("A")
    unload();
    console.debug("B")
    postMessage(webviewStatus.killed);
    self.close();
    console.debug("C")
  }
};

postMessage(webviewStatus.prepairing);