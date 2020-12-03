import {
    Application,
    Router,
    Context
} from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { WebSocketMiddleware } from "./websocket_middleware.ts";
import { WSServer } from "./socket_server.ts";

const app = new Application();
const router = new Router();
const socketServer = new WSServer();
const wsServer = new WebSocketMiddleware("/ws", socketServer.socket_handler());
app.use(wsServer.middleware());
app.use(router.routes());
app.use(router.allowedMethods());
router.get("/", async (context: Context) => {
    const decoder = new TextDecoder("utf-8");
    const bytes = Deno.readFileSync("./index.html");
    const text = decoder.decode(bytes);
    context.response.body = text;
});
console.log("Server running on localhost:3000");
await app.listen({ port: 3000 });