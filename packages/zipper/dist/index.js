"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const zip_bundle_1 = require("./lib/zip-bundle");
// package the root dist file
(0, zip_bundle_1.zipBundle)({
    distDirectory: (0, path_1.resolve)(__dirname, '../../dist'),
    buildDirectory: (0, path_1.resolve)(__dirname, '../../dist-zip'),
    distDirectoryName: 'extension',
});
