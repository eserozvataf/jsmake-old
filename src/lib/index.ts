import { assign } from 'ponyfills/lib/assign';
import { Consultant } from 'consultant/lib/esm';
import { JsMake } from './JsMake';

const jsmake = new JsMake();

const defaultParameters = {
    makefile: {
        type: Consultant.types.stringParameter,
        aliases: [ 'f' ],
        label: 'Makefile',
        parameter: 'FILE',
        description: 'Load tasks from FILE',
        'default': [ 'makefile.js' ],
        min: 0,
        max: undefined,
        validate: (value) => value.length >= 3 || 'minimum 3 chars required'
    },
    verbosity: {
        type: Consultant.types.stringParameter,
        label: 'Verbosity',
        description: 'Sets verbosity of log messages [debug, warn, info, error]',
        'default': 'info',
        values: [ 'debug', 'warn', 'info', 'error' ],
        uiHidden: true,
        min: 0,
        max: 1
    },
    version: {
        type: Consultant.types.booleanParameter,
        aliases: [ 'v' ],
        label: 'Version',
        description: 'Displays the jsmake version',
        'default': false,
        uiHidden: true,
        min: 0,
        max: 1
    },
    help: {
        type: Consultant.types.booleanParameter,
        aliases: [ 'h', '?' ],
        label: 'Help',
        description: 'Displays this help message',
        'default': false,
        uiHidden: true,
        min: 0,
        max: 1
    }
};

jsmake.taskRules.children = assign(jsmake.taskRules.children, defaultParameters);

// TODO load plugins, etc.
jsmake.task('tasks', {
    description: 'Lists defined tasks',
    uiHidden: true,
    action: (argv, logger) => {
        for (const task of jsmake.getTaskTree()) {
            logger.info(task);
        }
    }
});

// jsmake.task('menu', {
//     description: 'Displays the task menu',
//     uiHidden: true,
//     action: (argv) => {
//         jsmake.menu();
//     }
// });

jsmake.task('plugins add', {
    description: 'Adds a plugin',
    uiHidden: true,
    action: async (argv, logger) => {
        const pluginName = argv._[0];

        if (await jsmake.plugins.install(pluginName)) {
            logger.info(`plugin successfully added - ${pluginName}`);
        }
    }
});

jsmake.task('plugins remove', {
    description: 'Removes a plugin',
    uiHidden: true,
    action: async (argv, logger) => {
        const pluginName = argv._[0];

        if (await jsmake.plugins.uninstall(pluginName)) {
            logger.info(`plugin successfully removed - ${pluginName}`);
        }
    }
});

jsmake.task('test', {
    description: 'Test command #1',
    uiHidden: false,
    action: async (argv, logger) => {
        logger.info(`test #1 - ${argv.values.test.info}`);
    },

    children: {
        info: {
            type: 'stringParameter',
            label: 'Message',
            description: 'Specifies a custom message',
            'default': 'http://github.com/eserozvataf/',
            uiHidden: true,
            min: 0,
            max: 1
        }
    }
});

jsmake.task('tests first', {
    description: 'Test command #2',
    uiHidden: true,
    action: async (argv, logger) => {
        logger.info(`test #2 - ${argv.values.tests.first.info}`);
    },

    children: {
        info: {
            type: 'stringParameter',
            label: 'Message',
            description: 'Specifies a custom message',
            'default': 'http://github.com/eserozvataf/',
            uiHidden: true,
            min: 0,
            max: 1
        }
    }
});

// console.dir(jsmake.locateNode('plugins add'));
// console.dir(jsmake.tasks.plugins.add);
// console.dir(JSON.stringify(jsmake.buildConsultantRules(jsmake.tasks, []), null, 2));

jsmake.loadPlugins();

// console.dir(jsmake.taskRules, { showHidden: false, depth: null, colors: true });
// process.exit(0);

// jsmake.exec('test --info=hede');
// jsmake.exec('tests first --info=hede');

export = jsmake;
