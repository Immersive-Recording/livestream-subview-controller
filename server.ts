import { Application, Router, Context } from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { WebSocketMiddleware, handler } from "https://raw.githubusercontent.com/jcc10/oak_websoket_middleware/v1.0.1/mod.ts";
import { WebSocket, isWebSocketCloseEvent, isWebSocketPingEvent } from 'https://deno.land/std@0.77.0/ws/mod.ts'
import { parse } from "https://deno.land/std@0.79.0/flags/mod.ts";
import { delay } from "https://deno.land/std@0.79.0/async/mod.ts"
// deno-lint-ignore camelcase
import { BCC_Middleware } from "https://raw.githubusercontent.com/jcc10/oak_bundle-compile-cache_middleware/v1.0.1/mod.ts";
import { dof8, dof8Set } from "./client-ts/dof8.ts";
import * as AniHelpers from "./client-ts/animation-helpers.ts";

const parsedArgs = parse(Deno.args);

let rendererSocket: WebSocket | null;

const offset: dof8Set = {
    s0: {
        alpha: 0
    },
    s1: {
        Y: AniHelpers.degreesToRadians(-90)
    }
}
const freq = 1000 / 60;

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
                    socket.send(JSON.stringify(offset));
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

function degreesToRadians(degrees: number): number {
    const pi = Math.PI;
    return degrees * (pi / 180);
}

function adustByOffset(i: dof8Set): dof8Set{
    return AniHelpers.offsetMerge(i, offset);
}

function fadeIn(t: number, duration: number): number {
    return (t / duration);
}
function fadeOut(t: number, duration: number, endPoint: number): number {
    return (1 - ((t - (endPoint - duration)) / duration));
}

async function song10() {
    let t = 0;
    let frame = song10Gen(t);
    try{
        while(frame){
            rendererSocket?.send(JSON.stringify(adustByOffset(frame)));
            await delay(freq);
            t += freq;
            frame = song10Gen(t);
        }
        rendererSocket?.send(JSON.stringify(adustByOffset({
            s0: {
                alpha: 0
            }
        })));
    } catch {
        console.log("HI!")
    }
}

const song10StartS0 = {
    Y: 0
}
const song10EndS0 = {
    Y: AniHelpers.degreesToRadians(180)
}

function song10Gen(t: number): dof8Set|false {
    const r: dof8Set = {}
    r.s0 = { ...r.s0, ...AniHelpers.fadeIn(t, 500) };
    if (r.s0?.alpha && r.s0.alpha >= 1){
        r.s0 = {...r.s0, ...AniHelpers.fadeOut(t, 500, (1000 * 10))};
    }

    if (t <= (1000 * 10) + (freq * 2)){
        const tSub = AniHelpers.timeSubset(t, 0, (1000 * 10));
        const b = AniHelpers.spin(tSub, song10StartS0, song10EndS0);
        r.s0 = { ...r.s0, ...b};
        return r;
    }
    return false
}
async function communion7() {
    let t = 0;
    let frame = communion7Gen(t);
    try {
        while (frame) {
            rendererSocket?.send(JSON.stringify(adustByOffset(frame)));
            await delay(freq);
            t += freq;
            frame = communion7Gen(t);
        }
        rendererSocket?.send(JSON.stringify(adustByOffset({
            s0: {
                alpha: 0
            }
        })));
    } catch {
        console.log("HI!")
    }
}

function communion7Gen(t: number): dof8Set | false {
    const r: dof8Set = {}
    r.s0 = { ...r.s0, ...AniHelpers.fadeIn(t, 250) };
    if (r.s0?.alpha && r.s0.alpha >= 1) {
        r.s0 = { ...r.s0, ...AniHelpers.fadeOut(t, 250, (1000 * 7)) };
    }

    if (t <= (1000 * 7) + (freq * 2)) {
        r.s0.Y = degreesToRadians((t / (1000 * 7)) * 180);
        return r;
    }
    return false
}
async function after120() {
    let t = 0;
    let frame = after120Gen(t);
    try {
        while (frame) {
            rendererSocket?.send(JSON.stringify(adustByOffset(frame)));
            await delay(freq);
            t += freq;
            frame = after120Gen(t);
        }
        rendererSocket?.send(JSON.stringify(adustByOffset({
            s0: {
                alpha: 0
            }
        })));
    } catch {
        console.log("HI!")
    }
}

function after120Gen(t: number): dof8Set | false {
    const r: dof8Set = {}
    r.s0 = { ...r.s0, ...AniHelpers.fadeIn(t, 500) };
    if (r.s0?.alpha && r.s0.alpha >= 1) {
        r.s0 = { ...r.s0, ...AniHelpers.fadeOut(t, 500, (1000 * 120)) };
    }

    if (t <= (1000 * 10) + (freq * 2)) {
        r.s0.Y = degreesToRadians((t / (1000 * 120)) * 180);
        return r;
    }
    return false
}


router.get("/trigger/song10", (context: Context) => {
    song10();
    context.response.body = "running..."
    context.response.type = "text/html";
}).get("/trigger/communion7", (context: Context) => {
    communion7();
    context.response.body = "running..."
    context.response.type = "text/html";
}).get("/trigger/after120", (context: Context) => {
    after120();
    context.response.body = "running..."
    context.response.type = "text/html";
})

console.log("Server running on localhost:3000");
await app.listen({ port: 3000 });