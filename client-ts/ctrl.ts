/// <reference lib="esNext" />
/// <reference lib="dom" />
/// <reference lib="webworker.importScripts" />
/// <reference lib="ScriptHost" />
/// <reference lib="dom.iterable" />
/// <reference no-default-lib="true"/>

declare var document: Document;
import { RTC_MANAGER, WEBSOCKET_SIGNAL_CLIENT } from "https://raw.githubusercontent.com/jcc10/WebRTC_Manager/main/client_mod.ts";
import * as AniTests from "./test-animations-front.ts";
import * as settings from "./THREE-SETTINGS.ts";

const canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.width = settings.width;
canvas.height = settings.height;
const context = canvas.getContext("2d");
document.body.appendChild(canvas);

const wsSignals = new WEBSOCKET_SIGNAL_CLIENT(`${window.location.protocol == "https:" ? "wss" : "ws"}://${window.location.host}/rtc-signals`);
const rtcManager = new RTC_MANAGER<WEBSOCKET_SIGNAL_CLIENT>(wsSignals);
let renderer: RTCDataChannel | null = null;
const state = <HTMLParagraphElement> document.getElementById("state");
rtcManager.setOnNewConnect((uuid: string, pc: RTCPeerConnection) => {
    pc.ondatachannel = onDataChannel;
    pc.onconnectionstatechange = (e) => {
      switch (pc.connectionState) {
        case "connected":
          state.innerHTML = `Connected - ${uuid}`;
          break;
        case "disconnected":
        case "failed":
          state.innerHTML = `Disconnected / Failed - ${uuid}`;
          break;
        case "closed":
          state.innerHTML = `Closed - ${uuid}`;
          break;
      }
    }
});

function onDataChannel(ev: RTCDataChannelEvent) {
  renderer = ev.channel;
  console.log("New Connection!");
  setupDC(ev.channel);
}


const socket = new WebSocket(`${window.location.protocol == "https:" ? "wss" : "ws"}://${window.location.host}/controller`);
wsSignals.setUUIDUpdate((uuid: string) => {
  if (socket.readyState == 1) {
    socket.send(uuid);
  } else {
    socket.onopen = () => {
      socket.send(uuid);
    };
  }
});
socket.onmessage = (event: MessageEvent) => {
    const uuid = event.data;
    state.innerHTML = `Received - ${uuid}`
    const pc = rtcManager.connect(uuid, 1);
    console.log(`Started Connection to ${uuid}`);
    renderer = pc.createDataChannel("animationChannel");
    pc.ondatachannel = onDataChannel;
    pc.onconnectionstatechange = (e) => {
      switch (pc.connectionState) {
        case "connected":
          state.innerHTML = `Connected - ${uuid}`;
          break;
        case "disconnected":
        case "failed":
          state.innerHTML = `Disconnected / Failed - ${uuid}`;
          break;
        case "closed":
          state.innerHTML = `Closed - ${uuid}`;
          break;
      }
    };
    renderer.onopen = () => {
        console.log(`Connected to ${event.data}!`);
    }
}

const setupDC = (dc: RTCDataChannel) => {
  if (!dc) {
    return;
  }
  // ELSE
  dc.onmessage = (event: MessageEvent) => {
    if(!context || !canvas){
      console.warn(`missing ${!context ? "context" : ""} ${!canvas ? "canvas" : ""} !`)
      return;
    }
    console.log("received frame");
    var img = <HTMLImageElement>new Image();
    img.onload = function () {
      context.drawImage(img, 0, 0); // Or at whatever offset you like
    };
    img.src = event.data;
  };
};

const offset = <HTMLButtonElement>document.getElementById("offset")
const song10 = <HTMLButtonElement>document.getElementById("song10")
const communion7 = <HTMLButtonElement>document.getElementById("communion7")
const after120 = <HTMLButtonElement>document.getElementById("after120")
const mcUp = <HTMLButtonElement>document.getElementById("mcUp")
const mcDown = <HTMLButtonElement>document.getElementById("mcDown")
const preview = <HTMLButtonElement>document.getElementById("preview")
let animation = false;

offset.onclick = (event: MouseEvent) => {
  if(renderer?.readyState != "open"){
    return;
  }
    renderer.send(JSON.stringify([1, AniTests.offset]));
}

song10.onclick = async (event: MouseEvent) => {
  if(renderer?.readyState != "open"){
    return;
  }
  if(!animation){
    animation = true;
    await AniTests.animationLoop(renderer, AniTests.song10Gen);
    animation = false;
  }
    
}

communion7.onclick = async (event: MouseEvent) => {
  if(renderer?.readyState != "open"){
    return;
  }
  if(!animation){
    animation = true;
    await AniTests.animationLoop(renderer, AniTests.communion7Gen);
    animation = false;
  }
    
}

after120.onclick = async (event: MouseEvent) => {
  if(renderer?.readyState != "open"){
    return;
  }
  if(!animation){
    animation = true;
    await AniTests.animationLoop(renderer, AniTests.after120Gen);
    animation = false;
  }
    
}

mcUp.onclick = async (event: MouseEvent) => {
  if(renderer?.readyState != "open"){
    return;
  }
  if(!animation){
    animation = true;
    await AniTests.animationLoop(renderer, AniTests.mcUp);
    animation = false;
  }
    
}

mcDown.onclick = async (event: MouseEvent) => {
  if(renderer?.readyState != "open"){
    return;
  }
  if(!animation){
    animation = true;
    await AniTests.animationLoop(renderer, AniTests.mcDown);
    animation = false;
  }
    
}

preview.onclick = (event: MouseEvent) => {
  if (renderer?.readyState != "open") {
    return;
  }
  preview.disabled = true;
  //renderer.send(JSON.stringify([2, "remoteView"]));
};
