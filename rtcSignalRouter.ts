import { WebSocketMiddleware, wsHandler } from "https://raw.githubusercontent.com/jcc10/oak_websoket_middleware/v1.1.1/mod.ts";
import { WebSocket, isWebSocketCloseEvent, isWebSocketPingEvent } from 'https://deno.land/std@0.77.0/ws/mod.ts';
import { v4 } from "https://deno.land/std@0.77.0/uuid/mod.ts";
interface client {
    socket: WebSocket;
    uuid: string;
}
export class signalRouter {
    renderer: client | null = null;
    constructor() {

    }
    public socketHandler() {
        return async (
            socket: WebSocket,
            url: URL,
            headers: Headers,
        ): Promise<void> => {
            let uuid: string | undefined;
            // Wait for new messages
            try {
                for await (const ev of socket) {
                if (typeof ev === "string") {
                    if(!uuid){
                        if(!v4.validate(ev)){
                            socket.close(99, "Invalid UUID");
                            break;
                        }
                        uuid = ev;
                        if (url.pathname == "/renderer") {
                            this.renderer = {
                                socket,
                                uuid: uuid,
                            };
                            console.log(`Renderer UUID: ${uuid}`);
                        } else if (url.pathname == "/controller") {
                            console.log(`Controller UUID: ${uuid}`)
                            if(this.renderer){
                                socket.send(this.renderer.uuid);
                            }
                         }
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
            if (url.pathname == "/renderer") {
                this.renderer = null;
            }
            console.log(`${uuid} disconnected!`);
        };
    }
}