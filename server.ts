import {
    Application,
    Router,
    Context,
    send
} from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { assert } from "https://deno.land/std@0.79.0/testing/asserts.ts";

const bundles = {
    test: "",
}
{
    console.log("Bundling test...")
    const [diagnostics, emit] = await Deno.bundle(`${Deno.cwd()}/client/script/test.ts`);
    assert(diagnostics == null);
    bundles.test = emit;
}

const app = new Application();
const router = new Router();
app.use(router.routes());
app.use(router.allowedMethods());
router.get("/bundles/test.js", (context: Context) => {
    context.response.body = bundles.test;
    context.response.type = "application/javascript";
});
router.get("/", async (context: Context) => {
    await send(context, context.request.url.pathname, {
        root: `${Deno.cwd()}/client`,
        index: "index.html",
    });
});
console.log("Server running on localhost:3000");
await app.listen({ port: 3000 });