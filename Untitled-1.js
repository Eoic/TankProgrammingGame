


function onBotHit(){
    if(bot.getEnergy > 75)
        bot.shoot(target.pos);
    else bot.moveToPos(spawn.pos);
}



