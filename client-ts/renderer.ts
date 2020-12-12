/// <reference lib="esNext" />
/// <reference lib="dom" />
/// <reference lib="webworker.importScripts" />
/// <reference lib="ScriptHost" />
/// <reference lib="dom.iterable" />
/// <reference no-default-lib="true"/>

declare var document: Document;

import * as THREE from "https://cdn.skypack.dev/three?dts";
import { ThreeCode } from "./renderer-threeCode.ts";
import { dof8, dof8Set } from "./dof8.ts";
import { RTC_MANAGER, WEBSOCKET_SIGNAL_CLIENT } from "https://raw.githubusercontent.com/jcc10/WebRTC_Manager/main/client_mod.ts";

const three = new ThreeCode();

const wsSignals = new WEBSOCKET_SIGNAL_CLIENT(`ws://${window.location.host}/rtc-signals`)
const rtcManager = new RTC_MANAGER<WEBSOCKET_SIGNAL_CLIENT>(wsSignals);

rtcManager.setOnNewConnect((uuid: string, pc: RTCPeerConnection) => {
  pc.ondatachannel = (ev: RTCDataChannelEvent) => {
    console.log("New Connection!");
    setupDC(ev.channel);
  };
});

const setupDC = (dc: RTCDataChannel) => {
  if (!dc) {
    return;
  }
  // ELSE
  dc.onmessage = receiveMessage;
};

const receiveMessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data);
  if(data[0] == 1){
        const frame: dof8Set = <dof8Set> data[1];
        console.log(`DOF8 ${frame}`)
        for (const name in frame) {
            const obj = <THREE.Mesh> three.elems[name];
            const props: dof8 = frame[name];
            if (props.alpha !== undefined) {
                const met = <THREE.Material> obj.material;
                met.opacity = props.alpha;
            }
            if (props.X !== undefined) {
                obj.rotation.x = props.X;
            }
            if (props.Y !== undefined) {
                obj.rotation.y = props.Y;
            }
            if (props.Z !== undefined) {
                obj.rotation.z = props.Z;
            }
            if (props.x !== undefined) {
                obj.position.x = props.x;
            }
            if (props.y !== undefined) {
                obj.position.y = props.y;
            }
            if (props.z !== undefined) {
                obj.position.z = props.z;
            }
        }
  }
}

const socket = new WebSocket(`ws://${window.location.host}/renderer`);
wsSignals.setUUIDUpdate((uuid: string) => {
    if(socket.readyState == 1)
      socket.send(uuid);
    else {
      socket.onopen = () => {
        socket.send(uuid);
      }
    }
})

