import fs from 'node:fs';
import deepmerge from 'deepmerge';

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

const isFirefox = process.env.__FIREFOX__ === 'true';


const ip = "http://192.168.87.10/*" // Change to the IP of the kitchen display


const sidePanelConfig = {
  side_panel: {
    default_path: 'side-panel/index.html',
  },
  permissions: ['sidePanel'],
};

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = deepmerge(
  {
    manifest_version: 3,
    default_locale: 'en',
    name: '__MSG_extensionName__',
    version: packageJson.version,
    description: '__MSG_extensionDescription__',
    host_permissions: [
      "file:///*/*",
      "http://127.0.0.1/*",
      ip,
      "https://192.168.0.0/*", // For HTTPS if needed
      "http://*/*",
      "https://*/*"
    ],
    permissions: [
      'storage',
      'scripting',
      'activeTab',
      'tabs',
    ],
    options_page: 'options/index.html',
    background: {
      service_worker: 'background.iife.js',
      type: 'module',
      matches: ["file:///*/*", 'http://127.0.0.1/*', ip, 'http://*/*', 'https://*/*']
    },
    action: {
      default_popup: 'popup/index.html',
      default_icon: 'icon-34.png',
    },
    icons: {
      128: 'icon-128.png',
    },
    content_scripts: [
      {
        matches: ["file:///*/*", "http://127.0.0.1/*", ip, "https://192.168.0.0/*"],
        js: ['content/index.iife.js'],
        run_at: "document_end"
      },
      {
        matches: ["file:///*/*", "http://127.0.0.1/*", ip, "https://192.168.0.0/*"],
        js: ['content-ui/index.iife.js'],
      },
      {
        matches: ["file:///*/*", "http://127.0.0.1/*", ip, "https://192.168.0.0/*"],
        css: ['content.css'], // public folder
      },
    ],
    devtools_page: 'devtools/index.html',
    web_accessible_resources: [
      {
        resources: ['*.js', '*.css', '*.svg', 'icon-128.png', 'icon-34.png'],
        matches: ['*://*/*'],
      },
    ],
  },
  !isFirefox && sidePanelConfig,
);

export default manifest;
