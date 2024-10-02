(function() {let __HMR_ID = "0.4k7l99cyewr";
(function () {
  'use strict';

  const LOCAL_RELOAD_SOCKET_PORT = 8081;
  const LOCAL_RELOAD_SOCKET_URL = `ws://localhost:${LOCAL_RELOAD_SOCKET_PORT}`;

  class MessageInterpreter {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
     constructor() {}

    static send(message) {
      return JSON.stringify(message);
    }
    static receive(serializedMessage) {
      return JSON.parse(serializedMessage);
    }
  }

  function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
  function initReloadClient({ id, onUpdate }) {
    let ws = null;
    try {
      ws = new WebSocket(LOCAL_RELOAD_SOCKET_URL);
      ws.onopen = () => {
        _optionalChain([ws, 'optionalAccess', _ => _.addEventListener, 'call', _2 => _2('message', event => {
          const message = MessageInterpreter.receive(String(event.data));
          if (message.type === 'ping') {
            console.log('[HMR] Client OK');
          }
          if (message.type === 'do_update' && message.id === id) {
            sendUpdateCompleteMessage();
            onUpdate();
            return;
          }
        })]);
      };

      ws.onclose = () => {
        console.log(
          `Reload server disconnected.\nPlease check if the WebSocket server is running properly on ${LOCAL_RELOAD_SOCKET_URL}. This feature detects changes in the code and helps the browser to reload the extension or refresh the current tab.`,
        );
        setTimeout(() => {
          initReloadClient({ onUpdate, id });
        }, 1000);
      };
    } catch (e) {
      setTimeout(() => {
        initReloadClient({ onUpdate, id });
      }, 1000);
    }

    function sendUpdateCompleteMessage() {
      _optionalChain([ws, 'optionalAccess', _3 => _3.send, 'call', _4 => _4(MessageInterpreter.send({ type: 'done_update' }))]);
    }
  }

  function addRefresh() {
    let pendingReload = false;

    initReloadClient({
      // eslint-disable-next-line
      // @ts-ignore
      id: __HMR_ID,
      onUpdate: () => {
        // disable reload when tab is hidden
        if (document.hidden) {
          pendingReload = true;
          return;
        }
        reload();
      },
    });

    // reload
    function reload() {
      pendingReload = false;
      window.location.reload();
    }

    // reload when tab is visible
    function reloadWhenTabIsVisible() {
      !document.hidden && pendingReload && reload();
    }
    document.addEventListener('visibilitychange', reloadWhenTabIsVisible);
  }

  addRefresh();

})();

})();
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
try {
  console.log("Edit 'pages/devtools/src/index.ts' and save to reload.");
  chrome.devtools.panels.create("Dev Tools", "icon-34.png", "devtools-panel/index.html");
} catch (e) {
  console.error(e);
}
//# sourceMappingURL=index-BEXU0RbR.js.map
