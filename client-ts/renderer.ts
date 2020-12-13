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
import { delay } from "./delay.ts";

const updateSet: RTCDataChannel[] = [];

const three = new ThreeCode();
/*three.pushFrame = (frame: string) => {
  for(const dc of updateSet){
    if(dc.readyState == "open") {
      dc.send(frame);
    } else {
      console.warn(`DC ReadyState for Remote View is ${dc.readyState}`);
    }
  }
}*/

const wsSignals = new WEBSOCKET_SIGNAL_CLIENT(`ws://${window.location.host}/rtc-signals`)
const rtcManager = new RTC_MANAGER<WEBSOCKET_SIGNAL_CLIENT>(wsSignals);
const rtcVid: HTMLVideoElement = <HTMLVideoElement> document.getElementById("rtcVid");

rtcManager.setOnNewConnect((uuid: string, pc: RTCPeerConnection) => {
  pc.ondatachannel = (ev: RTCDataChannelEvent) => {
    console.log(`New Connection from ${uuid}!`);
    setupDC(uuid, ev.channel);
  };
  pc.ontrack = (event: RTCTrackEvent) => {
    console.log(`New Video Connection from ${uuid}`);
    onTrack(event);
  }
});

const onTrack = (event: RTCTrackEvent) => {
  if (!rtcVid) {
    throw new Error("NO VIDEO!");
  }  
  const streamZero = event.streams[0];
  if(rtcVid.srcObject !== streamZero){
    // @ts-ignore incubator item.
    event.receiver.playoutDelayHint = 1000
    rtcVid.srcObject = streamZero;
    const settings = streamZero.getVideoTracks()[0].getSettings();
    console.log(settings)
    rtcVid.width = settings.width ? settings.width : 1280;
    rtcVid.height = settings.height ? settings.height : 720;
  }
}

const setupDC = (uuid: string, dc: RTCDataChannel) => {
  dc.onmessage = (event) => {receiveMessage(dc, uuid, event)};
};

const receiveMessage = (dc: RTCDataChannel, uuid: string, event: MessageEvent) => {
  const data = JSON.parse(event.data);
  switch(data[0]){
    case 1:
      {
        const frame: dof8Set = <dof8Set> data[1];
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
        break;
      }
    case 2:
      {
        const name = data[1];
        if(name == "remoteView"){
          updateSet.push(dc);
          console.log(`New Remote View to ${uuid}`)
        }
        break;
      }
    case 3: 
      {
        rtcVid.width = data[1];
        rtcVid.height = data[2];
        console.log(`Video size set to ${data[1]}:${data[2]}`)
        break;
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

