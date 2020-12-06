import {
    Application,
    Router,
    Context,
    send
} from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { parse } from "https://deno.land/std@0.79.0/flags/mod.ts";
import { BCC } from "./bcc.ts";
const parsedArgs = parse(Deno.args);

const bcc = new BCC("client-ts", "bundled", "compiled", "cache", "/cache", false);
await bcc.clearAllCache()
console.log("All Caches Cleared!")
bcc.addCacheSource("skpk", "https://cdn.skypack.dev/");

const app = new Application();
const router = new Router();
app.use(router.routes());
app.use(router.allowedMethods());
router.get("/cache/:src/:script", async (context) => {
    if (context.params?.src && context.params?.script && bcc.validSource(context.params.src)) {
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
router.get("/", async (context: Context) => {
    await send(context, context.request.url.pathname, {
        root: `${Deno.cwd()}/static`,
        index: "index.html",
    });
}).get("/static/pano.jpg", async (context: Context) => {
    const imageBuf = await Deno.readFile(`${Deno.cwd()}/static/pano.jpg`);
    context.response.body = imageBuf;
    context.response.type = "image/jpg";
}).get("/static/pano.mp4", async (context: Context) => {
    const imageBuf = await Deno.readFile(`${Deno.cwd()}/static/pano.mp4`);
    context.response.body = imageBuf;
    context.response.type = "application/mp4";
});
console.log("Server running on localhost:3000");
await app.listen({ port: 3000 });