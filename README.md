# Immersive Studio
A application for remote controlling compositing of multiple cameras and/or camera views (along with audio potentially) for recording or live-streaming. Titular feature is with regards to the fact that this can handle 360° live camera feeds for down-mixing to more normal perspectives.

# WARNING
## This is currently under heavy development, programming knowledge is required to use.

## Required permissions:
* `--unstable` between `deno` and `run`.
* `-A` because I can't be bothered to figure stuff out right now. (and yes, I know that is hypocritical, I don't care.)

## Application flags
* `-r`: Refresh, Clears all caches.
* `--dev`: Newly compiled files will not have urls rewritten so they are accessed from this server, they will instead be accessed from the internet.
* `-c`: Pre-Compile. Will pre-compile a set of files prior to the server starting up, regardless of them being currently compiled.
* `-b` (Unimplemented): Pre-Builds. Will pre-build files. Use this once while online. Then when you are offline the program will still work.

## Required Pre-Req:
1. Install & Enable hls cors proxy site conf.
2. Install & Enable Proxy* and Header* (Or whatever they are)
3. Start 360 camera.
4. Fix **BOTH** hls cors proxy ips.
5. Test stream.
6. Adjust the test-animations settings.
7. ???
8. Stream and/or Record.