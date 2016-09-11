import events from 'events';
import maester from 'maester';
import Task from './Task.js';
import RunContext from './RunContext.js';
import Utils from './Utils.js';

const errors = {
    no_arguments: Symbol('no arguments'),
    unknown_task: Symbol('unknown task'),
    task_validation_failed: Symbol('task validation failed')
};

class JsMake {
    constructor() {
        this.events = new events.EventEmitter();
        this.tasks = {};
        this.logger = maester;
        this.utils = new Utils();
    }

    loadFile(filepath) {
        const _jsmake = global.jsmake;

        global.jsmake = this;
        require(filepath);

        global.jsmake = _jsmake;
    }

    task(name, p1, p2) {
        // p1 as task instance
        if (p1.constructor !== Array && p1.constructor !== Function && p1 instanceof Object) {
            this.tasks[name] = p1;
        }
        // p1 as method
        else if (p2 === undefined) {
            this.tasks[name] = new Task(this, name, [], p1);
        }
        // p1 as prerequisites, p2 as method
        else {
            this.tasks[name] = new Task(this, name, p1, p2);
        }
    }

    validateArgvAndGetTask(argv) {
        let taskname;

        if (argv._.length === 0) {
            taskname = 'default';
        }
        else {
            taskname = argv._.shift();
        }

        if (!(taskname in this.tasks)) {
            return { error: errors.unknown_task, taskname: taskname };
        }

        return { error: null, task: this.tasks[taskname] };
    }

    async execRunContext(runContext) {
        try {
            const validateResult = this.validateArgvAndGetTask(runContext.argv);

            if (validateResult.error === errors.no_arguments) {
                this.help();

                return null;
            }

            if (validateResult.error === errors.unknown_task) {
                this.logger.error(`unknown task name - ${validateResult.taskname}`);

                return null;
            }

            const task = validateResult.task;

            if (task.validate !== undefined && !task.validate(runContext.argv)) {
                if (task.help !== undefined) {
                    task.help();
                }

                return null;
            }

            runContext.addTask(task);

            return await runContext.execute();
        }
        catch (ex) {
            this.logger.error(ex);
        }
    }

    async exec(args) {
        const runContext = new RunContext(this);

        runContext.setArgs(args);

        this.execRunContext(runContext);
    }

    help() {
        this.logger.info('Usage: jsmake [command]');
    }
}

module.exports = new JsMake();
