export async function complie_clientside(directory: string | URL ): Promise<any> {
    let dir: string = directory.toString();
    if(dir[dir.length - 1] != "/"){
        dir += "/";
    }
    let items = await recursive_file_finder(dir);
    for(let item of items){
        
    }
}

const isTypeScript = /.*\.ts/

async function recursive_file_finder(directory: string | URL): Promise<Array<string>> {
    let rets: Array<string> = new Array();
    for await (let entry of Deno.readDir(directory)){
        if(entry.isDirectory){
            rets.push(...await recursive_file_finder(`${directory}${entry.name}/`));
        }
        if(entry.isFile){
            if(isTypeScript.test(entry.name)){
                rets.push(`${directory}${entry.name}`);
            }
        }
    }
    return rets;
}