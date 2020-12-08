import { Application, Router, Context } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { WebSocketMiddleware, handler } from "https://raw.githubusercontent.com/jcc10/oak_websoket_middleware/v1.0.1/mod.ts";
import { WebSocket, isWebSocketCloseEvent, isWebSocketPingEvent } from 'https://deno.land/std@0.77.0/ws/mod.ts';
import { parse } from "https://deno.land/std@0.79.0/flags/mod.ts";
// deno-lint-ignore camelcase
import { BCC_Middleware } from "https://raw.githubusercontent.com/jcc10/oak_bundle-compile-cache_middleware/v1.0.2/mod.ts";
import * as AniTests from "./client-ts/test-animations.ts";

const parsedArgs = parse(Deno.args);

let rendererSocket: WebSocket | null;
const socketHandler: handler = async function (socket: WebSocket, url: URL): Promise<void> {
    if (url.pathname == "/renderer"){
        rendererSocket = socket;
        console.log("rendererBound");
    }
    // Wait for new messages
    try {
        for await (const ev of socket) {
            if (typeof ev === "string") {
                if (ev == "ready") {
                    socket.send(JSON.stringify(AniTests.offset));
                }
                // text message
            } else if (isWebSocketPingEvent(ev)) {
                const [, body] = ev;
                // ping
                // stub
                //console.log("ws:Ping", body);
            } else if (isWebSocketCloseEvent(ev)) {
                // close
                const { code, reason } = ev;
                //console.log("ws:Close", code, reason);
            }
        }
    } catch (err) {
        console.error(`failed to receive frame: ${err}`);

        if (!socket.isClosed) {
            await socket.close(99).catch(console.error);
        }
    }
    console.log("Renderer Lost");
    rendererSocket = null;

}

const app = new Application();
const router = new Router();
app.use(WebSocketMiddleware(socketHandler));
const bccMiddle = new BCC_Middleware({
    BCC_Settings: {
        tsSource: "client-ts",
        bundleFolder: "bundled",
        compiledFolder: "compiled",
        cacheFolder: "cache",
        cacheRoot: "/cache",
        mapSources: !parsedArgs.dev
    }
})
if (parsedArgs.r) {
    await bccMiddle.bcc.clearAllCache()
    console.log("All Caches Cleared!")
}
if (parsedArgs.c) {
    const preCompileList = [
        "dof8.ts",
        "animation-helpers.ts",
        "test-animations.ts",
        "test2.ts",
        "ctrl.ts",
    ]
    for (const item of preCompileList){
        console.log(`Pre-Compiling ${item}`)
        await bccMiddle.bcc.compile(item);
    }
}
bccMiddle.bcc.addCacheSource("SkyPack", "https://cdn.skypack.dev/");
app.use( async (context: Context, next) => {
    await next();
})
app.use(bccMiddle.middleware())
app.use(async (context: Context, next: () => Promise<void>) => {
    if (context.request.url.pathname.startsWith("/-/")) {
        context.response.body = await bccMiddle.bcc.scriptCache(context.request.url.pathname.replace("/", ""), "SkyPack");
        context.response.type = "text/javascript";
    } else {
        await next();
    }
})
app.use(router.routes());
app.use(router.allowedMethods());

router.get("/renderer.html", async (context: Context) => {
    console.log("Hit renderer.")
    context.response.body = await Deno.readTextFile(`${Deno.cwd()}/static/renderer.html`);
    context.response.type = "text/html";
}).get("/index.html", async (context: Context) => {
    console.log("Hit Index.")
    context.response.body = await Deno.readTextFile(`${Deno.cwd()}/static/index.html`); 
    context.response.type = "text/html";
}).get("/", async (context: Context) => {
    console.log("Hit Index.")
    context.response.body = await Deno.readTextFile(`${Deno.cwd()}/static/index.html`);
    context.response.type = "text/html";
}).get("/test.mp4", async (context: Context) => {
    console.log("Hit Index.");
    const imageBuf = await Deno.readFile(`${Deno.cwd()}/static/first-1-min.mp4`);
    context.response.body = imageBuf;
    context.response.type = "text/html";
});

router.get("/trigger/song10", (context: Context) => {
    AniTests.animationLoop(rendererSocket, AniTests.song10Gen);
    context.response.body = "running..."
    context.response.type = "text/html";
}).get("/trigger/communion7", (context: Context) => {
    AniTests.animationLoop(rendererSocket, AniTests.communion7Gen);
    context.response.body = "running..."
    context.response.type = "text/html";
}).get("/trigger/after120", (context: Context) => {
    AniTests.animationLoop(rendererSocket, AniTests.after120Gen);
    context.response.body = "running..."
    context.response.type = "text/html";
})

console.log("Server running on localhost:3000");
await app.listen({ port: 3000 });