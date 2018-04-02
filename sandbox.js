/**
 * JavaScript sandbox used for running untrusted code.
 * All game code written by user should be ran through here.
 */

const {NodeVM} = require('vm2');

const vm = new NodeVM({
    sandbox: {},
    require: {
        console: 'inherit', // For debugging only.
        external: true
    }
});

exports.runVM = function(){
    vm.run(`
        // VM code.
    `, 
    './sandbox.js');
}