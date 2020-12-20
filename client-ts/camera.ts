/// <reference lib="esNext" />
/// <reference lib="dom" />
/// <reference lib="webworker.importScripts" />
/// <reference lib="ScriptHost" />
/// <reference lib="dom.iterable" />
/// <reference no-default-lib="true"/>

declare var document: Document;
declare var navigator: Navigator;
import { RTC_MANAGER, WEBSOCKET_SIGNAL_CLIENT } from "https://raw.githubusercontent.com/jcc10/WebRTC_Manager/main/client_mod.ts";

let localStream: MediaStream;
let settings: MediaTrackSettings;

const wsSignals = new WEBSOCKET_SIGNAL_CLIENT(`${window.location.protocol == "https:" ? "wss" : "ws"}://${window.location.host}/rtc-signals`);
const rtcManager = new RTC_MANAGER<WEBSOCKET_SIGNAL_CLIENT>(wsSignals);
let renderer: RTCDataChannel | null = null;
rtcManager.setOnNewConnect((uuid: string, pc: RTCPeerConnection) => {
    pc.ondatachannel = onDataChannel;
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
socket.onmessage = async (event: MessageEvent) => {
    const pc = rtcManager.connect(event.data, 1);
    console.log(`Started Connection to ${event.data}`);
    await startStreams();
    if(!localStream){
      return;
    }
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    renderer = pc.createDataChannel("animationChannel");
    pc.ondatachannel = onDataChannel;
}

const setupDC = (dc: RTCDataChannel) => {
  dc.onmessage = () => {};
  if(settings.width && settings.height)
  dc.send(JSON.stringify([3, settings.width, settings.height]));
};

const startStreams = async () => {
  const localVid: HTMLVideoElement = <HTMLVideoElement> document.getElementById(
    "localVid",
  );
  if (!localVid) {
    throw new Error("NO VIDEO!");
  }
  try {
    let stream: MediaStream | null = null;
    const constraints = [
      {
        audio: true,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment",
        },
      },
      {
        audio: true,
        video: {
          facingMode: "environment",
        },
      },
      {
        audio: true,
        video: true,
      },
      false
    ]
    for(const constraint of constraints){
      console.log(`Trying constraint: ${JSON.stringify(constraint)}`)
      if(typeof constraint == "boolean"){
        alert("No Devices found!");
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraint);
        break;
      } catch (e) {
        if (!(e instanceof DOMException)) {
          throw e;
        }
        if (e.name == "NotFoundError") {
          stream = null;
        }
      }
    }
    if(!stream){
      return;
    }
    localStream = stream;
    const videoTracks = localStream.getVideoTracks();
    const audioTracks = localStream.getAudioTracks();
    if (videoTracks.length > 0) {
      console.log(`Using video device: ${videoTracks[0].label}`);
    }
    if (audioTracks.length > 0) {
      console.log(`Using audio device: ${audioTracks[0].label}`);
    }
    localVid.srcObject = stream;
    localVid.muted = true;
    settings = stream.getVideoTracks()[0].getSettings();
    localVid.width = settings.width ? settings.width : localVid.width;
    localVid.height = settings.height ? settings.height : localVid.height;
    if(renderer){
      renderer.send(JSON.stringify([3, settings.width, settings.height]));
    }
    localVid.play();
  } catch (e) {
    alert(`getUserMedia() error: ${e.toString()}`);
    console.log(e.name);
    if(!(e instanceof DOMException)){
      throw e;
    }
    throw e;
  }
}