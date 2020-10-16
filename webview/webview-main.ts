import {webviewStatus} from "./status-enums.ts";
import type { WebViewParams } from "https://deno.land/x/webview@0.4.7/mod.ts";

export class FreeWebView {
    public status: webviewStatus;
    public static webviewStatus = webviewStatus;
    private worker: Worker;
    private statusPromises: Map<webviewStatus, Array<() => void>> = new Map<webviewStatus, Array<() => void>>();
    private options: WebViewParams;

    constructor(options: WebViewParams){
        this.status = webviewStatus.loading;
        this.options = options;
        this.worker = new Worker(
            new URL("webview-runner.ts", import.meta.url).href,
            { type: "module", deno: true },
        );

        this.worker.onmessage = (message) => {
            switch (message.data) {
                case webviewStatus.prepairing:
                    this.worker.postMessage(this.options);
                    this.status = webviewStatus.prepairing;
                    break;
                case webviewStatus.starting:
                    this.status = webviewStatus.starting;
                    break;
                case webviewStatus.running:
                    this.status = webviewStatus.running;
                    break;
                case webviewStatus.closing:
                    this.status = webviewStatus.closing;
                    break;
                case webviewStatus.unloading:
                    this.status = webviewStatus.unloading;
                    break;
                case webviewStatus.killed:
                    this.status = webviewStatus.killed;
                    break;
            }
            console.debug(message.data);
            this.resolvePromises(message.data);
        }
    }

    private resolvePromises(status: webviewStatus){
        for(let p of this.statusPromises.get(status) || []){
            p();
        }
    }

    statusPromise(reqStatus: webviewStatus): Promise<void> {
        if(this.status >= reqStatus){
            return Promise.resolve();
        } else {
            return new Promise((res) => {
                let statusArray = this.statusPromises.get(reqStatus);
                if(!statusArray)
                    statusArray = [];
                statusArray.push(res);
                this.statusPromises.set(reqStatus, statusArray);
            });
        }
    }
}