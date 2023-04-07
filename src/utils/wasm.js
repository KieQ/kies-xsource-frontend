import Module from "./kie_crypto";

export var wasm;

async function init(){
    wasm = await Module(); 
}

init();