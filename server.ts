import {
    Application,
    Router,
    Context,
    send
} from "https://deno.land/x/oak@v6.3.2/mod.ts";
import { WebSocketMiddleware, handler } from "https://raw.githubusercontent.com/jcc10/oak_websoket_middleware/v1.0.1/mod.ts";
import { WebSocket, isWebSocketCloseEvent, isWebSocketPingEvent } from 'https://deno.land/std@0.77.0/ws/mod.ts'
import { parse } from "https://deno.land/std@0.79.0/flags/mod.ts";
import { delay } from "https://deno.land/std@0.79.0/async/mod.ts"
import { BCC } from "./bcc.ts";
const parsedArgs = parse(Deno.args);

const bcc = new BCC({
    tsSource: "client-ts",
    bundleFolder: "bundled",
    compiledFolder: "compiled",
    cacheFolder: "cache",
    cacheRoot: "/cache",
    mapSources: true
});

if(parsedArgs.r){
    await bcc.clearAllCache()
    console.log("All Caches Cleared!")
}
bcc.addCacheSource("skpk", "https://cdn.skypack.dev/");

let rendererSocket: WebSocket | null;

const offset: Record<string, dof8> = {
    s0: {
        alpha: 0
    },
    s1: {
        Y: degreesToRadians(-90)
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
app.use(async (context:Context, next: ()=>Promise<void>)=>{
    if(context.request.url.pathname.startsWith("/-/")) {
        context.response.body = await bcc.scriptCache(context.request.url.pathname.replace("/", ""), "skpk");
        context.response.type = "text/javascript";
    } else {
        await next();
    }
})
app.use(router.routes());
app.use(router.allowedMethods());
router.get("/cache/:src/:script", async (context) => {
    if (context.params?.src && context.params?.script && bcc.validSource(context.params.src)) {
        console.log(`cacheRecovery: ${context.params.src}`)
        console.log(`         More: ${context.params.script}`)
        context.response.body = await bcc.scriptCache(context.params.script , context.params.src);
        context.response.type = "text/javascript";
    }
}).get("/compiled/:script", async (context) => {
    if (context.params?.script && bcc.valid(context.params.script)) {
        context.response.body = await bcc.cachedCompile(context.params.script);
        context.response.type = "text/javascript";
    }
}).get("/bundled/:script", async (context) => {
    if (context.params?.script && bcc.valid(context.params.script)) {
        context.response.body = await bcc.cachedBundle(context.params.script);
        context.response.type = "text/javascript";
    }
});

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

interface dof8 {
    x?: number,
    y?: number,
    z?: number,
    X?: number,
    Y?: number,
    Z?: number,
    scale?: number,
    alpha?: number,
}

function degreesToRadians(degrees: number): number {
    const pi = Math.PI;
    return degrees * (pi / 180);
}

function adustByOffset(i: Record<string, dof8>): Record<string, dof8>{
    const o: Record<string, dof8> = {};
    for(const r in i){
        if(offset[r]){
            const os: dof8 = offset[r]
            const l: dof8 = i[r];
            const u: dof8 = {};
            if(l.x) {
                if (os.x){
                    u.x = os.x + l.x
                } else {
                    u.x = l.x
                }
            }
            if(l.y) {
                if (os.y){
                    u.y = os.y + l.y
                } else {
                    u.y = l.y
                }
            }
            if(l.z) {
                if(os.z){
                    u.z = os.z + l.z
                } else {
                    u.z = l.z
                }
            }
            if(l.X) {
                if(os.X){
                    u.X = os.X + l.X
                } else {
                    u.X = l.X
                }
            }
            if(l.Y) {
                if(os.Y){
                    u.Y = os.Y + l.Y
                } else {
                    u.Y = l.Y
                }
            }
            if(l.Z) {
                if(os.Z){
                    u.Z = os.Z + l.Z
                } else {
                    u.Z = l.Z
                }
            }
            if (l.scale) {
                if (os.scale){
                    u.scale = os.scale + l.scale
                } else {
                    u.scale = l.scale
                }
            }
            if (l.alpha) {
                if (os.alpha){
                    u.alpha = os.alpha + l.alpha
                } else {
                    u.alpha = l.alpha
                }
            }
            o[r] = u;
        } else {
            o[r] = i[r];
        }
    }
    return o;
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

function song10Gen(t: number): Record<string, dof8>|false {
    const r: Record<string, dof8> = {
        s0: {}
    }
    if(t <= 500){
        r.s0.alpha = fadeIn(t, 500);
    }else {
        r.s0.alpha = fadeOut(t, 500, (1000 * 10));
    }

    if (t <= (1000 * 10) + (freq * 2)){
        r.s0.Y = degreesToRadians((t / (1000 * 10)) * 180);
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

function communion7Gen(t: number): Record<string, dof8> | false {
    const r: Record<string, dof8> = {
        s0: {}
    }
    if (t <= 250) {
        r.s0.alpha = fadeIn(t, 250);
    } else {
        r.s0.alpha = fadeOut(t, 250, (1000 * 7));
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

function after120Gen(t: number): Record<string, dof8> | false {
    const r: Record<string, dof8> = {
        s0: {}
    }
    if (t <= 500) {
        r.s0.alpha = fadeIn(t, 500);
    } else {
        r.s0.alpha = fadeOut(t, 500, (1000 * 120));
    }

    if (t <= (1000 * 120) + (freq * 2)) {
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