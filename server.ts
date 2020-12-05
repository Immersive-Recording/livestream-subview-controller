import {
    Application,
    Router,
    Context,
    send
} from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { assert } from "https://deno.land/std@0.79.0/testing/asserts.ts";

const compiled: Map<string, string> = new Map<string, string>();
{
    console.log("Compiling test...")
    const [diagnostics, emitMap] = await Deno.compile(
        `./client/script/test.ts`,
        undefined,
        {
            sourceMap: false,
            inlineSourceMap: true,
        }
        );
    assert(diagnostics == null, `Compile Error: ${JSON.stringify(diagnostics)}`);
    const cwd = `file://${Deno.cwd()}/client/script/`;
    for(const resource in emitMap){
        compiled.set(resource.replace(cwd, ""), emitMap[resource]);
    }
}

{
    console.log("The following have been re-compiled...");
    for(const k of compiled.keys()){
        console.log(k);
    }
}

const app = new Application();
const router = new Router();
app.use(router.routes());
app.use(router.allowedMethods());
router.get("/compiled/:script", (context) => {
    console.log(context.params?.script);
    if (context.params?.script && compiled.has(context.params.script)) {
        console.log(compiled.has(context.params.script))
        context.response.body = compiled.get(context.params.script);
        context.response.type = "text/javascript";
    }
})
router.get("/", async (context: Context) => {
    await send(context, context.request.url.pathname, {
        root: `${Deno.cwd()}/client`,
        index: "index.html",
    });
});
console.log("Server running on localhost:3000");
await app.listen({ port: 3000 });