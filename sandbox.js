/**
 * JavaScript sandbox used for running untrusted code.
 * All game code written by user should be ran through here.
 */

const { NodeVM } = require('vm2');

const vm = new NodeVM({
    sandbox: {},
    require: {
        console: 'inherit', // For debugging only.
        external: true
    }
});

exports.runVM = function(){
    vm.run(
        `
            const PIXI = require('pixi-shim');
            let app = new PIXI.Application({width: 256, height: 256});
            app.ticker.add(delta => gameLoop(delta));
            
            function gameLoop(){
                console.log('FPS: ' + app.ticker.FPS);
            }
        `
    , 
    'sandbox.js');
}