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

const wsSignals = new WEBSOCKET_SIGNAL_CLIENT(`ws://${window.location.host}/rtc-signals`);
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


const socket = new WebSocket(`ws://${window.location.host}/controller`);
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
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
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
    settings = stream.getVideoTracks()[0].getSettings();
    localVid.width = settings.width ? settings.width : localVid.width;
    localVid.height = settings.height ? settings.height : localVid.height;
    if(renderer){
      renderer.send(JSON.stringify([3, settings.width, settings.height]));
    }
    localVid.play();
  } catch (e) {
    alert(`getUserMedia() error: ${e.name}`);
  }
}