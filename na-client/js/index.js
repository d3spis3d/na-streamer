import fs from 'fs';
import path from 'path';
import commandLineArgs from 'command-line-args';
import uuid from 'node-uuid';
import dir from 'node-dir';
import promisify from 'promisify-node';

import {startClient} from './lib/client';
import {reduceAndMemoize} from './lib/helper';
import applyClientHandlers from './lib/client-handlers';
import setupFileWatcher from './lib/files/setup-file-watcher';

const CLIENT_KEYFILE = '.clientkey';

const cli = commandLineArgs([
    {
        name: 'dir',
        alias: 'd',
        type: String
    },
    {
        name: 'host',
        alias: 'h',
        type: String,
        defaultValue: 'localhost'
    },
    {
        name: 'port',
        alias: 'p',
        type: String,
        defaultValue: 9000
    }
]);
const options = cli.parse();
const filesById = {};

const keyPath = path.join(options.dir, CLIENT_KEYFILE);
let key;

try {
    const stats = fs.statSync(keyPath);
    if (stats.isFile()) {
        key = fs.readFileSync(keyPath, 'utf8');
    } else {
        key = uuid.v4();
        fs.writeFileSync(keyPath, key);
    }
} catch(e) {
    console.log('caught');
    key = uuid.v4();
    fs.writeFileSync(keyPath, key);
}

const processTracks = reduceAndMemoize(filesById, 'id', 'file');
const dirFiles = promisify(dir.files);

dirFiles(options.dir)
.then(files => {
    return processFiles(processTracks, options.dir, key, files);
})
.then(tracks => {
    return startClient(filesById);
})
.then(client => {
    applyClientHandlers(client, filesById, options, key, tracks);
    setupFileWatcher(client, processTracks, options.dir, key);
});
