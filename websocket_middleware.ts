import { WebSocket, acceptWebSocket, acceptable } from 'https://deno.land/std@0.76.0/ws/mod.ts'
export class WebSocketMiddleware {
    public sockets: WebSocket[] = [];
    public pathname: string;
    public handler: (socket: WebSocket) => Promise<void | null>;
    constructor(pathname: string, handler: (socket: WebSocket)=>Promise<void>) {
        this.pathname = pathname;
        this.handler = handler;
    }

    private async real_middleware(ctx: any, next: any) {
        if (ctx.request.url.pathname != this.pathname) {
            return await next();
        }
        if (ctx.request.headers.get("upgrade") !== "websocket") {
            ctx.response.status = 200;
            return;
        }

        const { conn, r: bufReader, w: bufWriter, headers } =
            ctx.request.serverRequest;

        try {
            const sock = await acceptWebSocket({
                conn,
                bufReader,
                bufWriter,
                headers,
            });

            this.handler(sock);
        } catch (err) {
            console.error(`Dev Server failed to accept websocket: ${err}`);
            ctx.response.status = 400;
        }
    }

    public middleware() {
        let self = this;
        return (ctx: any, next: any) => {this.real_middleware(ctx, next)};
    }
}