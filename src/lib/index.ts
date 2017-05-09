import { JsMake } from './JsMake';

const jsmake = new JsMake();

// TODO load plugins, etc.
jsmake.desc('Lists defined tasks');
jsmake.task('tasks', function (argv) {
    for (const task of jsmake.getTaskNames()) {
        console.log(task);
    }
});
jsmake.tasks.tasks.menuHidden = true;

jsmake.desc('Displays the task menu');
jsmake.task('menu', function (argv) {
    jsmake.menu();
});
jsmake.tasks.menu.menuHidden = true;

jsmake.desc('Adds a plugin');
jsmake.task('plugins add', async function (argv) {
    const pluginName = argv._[0];

    if (await jsmake.plugins.install(pluginName)) {
        console.log(`plugin successfully added - ${pluginName}`);
    }
});
jsmake.tasks.plugins.add.menuHidden = true;

jsmake.desc('Removes a plugin');
jsmake.task('plugins remove', async function (argv) {
    const pluginName = argv._[0];

    if (await jsmake.plugins.uninstall(pluginName)) {
        console.log(`plugin successfully removed - ${pluginName}`);
    }
});
jsmake.tasks.plugins.remove.menuHidden = true;

jsmake.desc('Test command');
jsmake.task('test', async function (argv) {
    const pluginName = argv._[0];

    console.log(`test - ${pluginName}`);
});
jsmake.tasks.test.menuHidden = true;

jsmake.loadPlugins();

// console.log(JSON.stringify(jsmake.tasks, undefined, 4));
// process.exit(0);

export = jsmake;