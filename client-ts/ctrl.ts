/// <reference lib="esNext" />
/// <reference lib="dom" />
/// <reference lib="webworker.importScripts" />
/// <reference lib="ScriptHost" />
/// <reference lib="dom.iterable" />
/// <reference no-default-lib="true"/>

declare var document: Document;

const song10 = <HTMLButtonElement>document.getElementById("song10")
const communion7 = <HTMLButtonElement>document.getElementById("communion7")
const after120 = <HTMLButtonElement>document.getElementById("after120")

song10.onclick = async (event: MouseEvent) => {
    await fetch("/trigger/song10");
}

communion7.onclick = async (event: MouseEvent) => {
    await fetch("/trigger/communion7");
}

after120.onclick = async (event: MouseEvent) => {
    await fetch("/trigger/after120");
}