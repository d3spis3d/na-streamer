import fs from 'fs';
import path from 'path';
import commandLineArgs from 'command-line-args';
import uuid from 'node-uuid';

import {startClient} from './lib/client';

const CLIENT_KEYFILE = '.clientkey';

const cli = commandLineArgs([
    {
        name: 'dir',
        alias: 'd',
        type: String
    }
]);
const options = cli.parse();
const filesById = {};

const keyPath = path.join(options.dir, CLIENT_KEYFILE);
let key;



fs.stat(keyPath, (err, stats) => {
    if (err === null && stats.isFile()) {
        key = fs.readFileSync(keyPath, 'utf8');
    } else {
        key = uuid.v4();
        const file = fs.writeFileSync(keyPath, key);
    }

    startClient(filesById, options.dir);
});
