import fs from 'fs';
import path from 'path';
import commandLineArgs from 'command-line-args';
import uuid from 'node-uuid';
import dir from 'node-dir';
import watch from 'watch';
import promisify from 'promisify-node';

import Client from './client/client';
import { fileProcessor, fileWatcher } from './files/files-processing';

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

const keyPath = path.join(options.dir, CLIENT_KEYFILE);
let key;

try {
    const stats = fs.statSync(keyPath);
    if (stats.isFile()) {
        key = fs.readFileSync(keyPath, 'utf8');
	} else {
        key = uuid.v4()
        fs.writeFileSync(keyPath, key);
	}
} catch(e) {
    key = uuid.v4();
    fs.writeFileSync(keyPath, key);
}

const dirFiles = promisify(dir.files);

const client = Client(options, key);

dirFiles(options.dir)
.then(files => fileProcessor(client.getFiles(), options.dir, key, files))
.then(tracks => client.start(tracks))
.then(() => {
    watch.createMonitor(musicDir, (monitor) => {
        fileWatcher(monitor, client.getFiles(), client.sendTracks, musicDir, key);
    });
});
