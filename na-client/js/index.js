import commandLineArgs from 'command-line-args';

import {startClient} from './lib/client';

const cli = commandLineArgs([
    {
        name: 'dir',
        alias: 'd',
        type: String
    }
]);
const options = cli.parse();

const filesById = {};

startClient(filesById, options.dir);
