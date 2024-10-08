const WASM_MOD_URL = chrome.runtime.getURL('js/wasm/wasm_mod.js');


// Import Wasm module binding using dynamic import.
// "init" may fail if the current site CSP restricts the use of Wasm (e.g. any github.com page).
// In this case instantiate module in the background worker (see background.js) and use message passing.
const loadWasmModule = async () => {
    const mod = await import(WASM_MOD_URL);

    // default export is an init function
    const isOk = await mod.default().catch((e) => {
        console.warn('Failed to init wasm module in content script. Probably CSP of the page has restricted wasm loading.', e);
        return null;
    });

    return isOk ? mod : null;
};


(async () => {
    const mod = await loadWasmModule();

    // If the module is successfully initialized,
    // import entities from the module
    if (mod) {
        const { hello_content } = mod;

        hello_content();
    }
})();