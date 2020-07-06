require('./config.js');

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));
    server.queue.shift();

    server.dispatcher.on("end", function(){
       if(server.queue[0]) play(connection, message);
       else connection.disconnect();
    });
}

bot.on('message', message =>{
    let role = message.guild.roles.find("name", cargo_principal);
    var data = new Date();

    var dia     = data.getDate();           // 1-31
    var dia_sem = data.getDay();            // 0-6 (zero=domingo)
    var mes     = data.getMonth();          // 0-11 (zero=janeiro)
    var ano2    = data.getYear();           // 2 dígitos
    var ano4    = data.getFullYear();       // 4 dígitos
    var hora    = data.getHours();          // 0-23
    var min     = data.getMinutes();        // 0-59
    var seg     = data.getSeconds();        // 0-59
    var mseg    = data.getMilliseconds();   // 0-999
    var tz      = data.getTimezoneOffset(); // em minutos

    const PREFIX ="!";
    const args = message.content.substring(PREFIX.length).split(" ");
    var str_data = dia + '/' + (mes+1) + '/' + ano4;
    var str_hora = hora + ':' + min + ':' + seg;

    let responseObject = {
        "que horas são?" : 'Hoje é dia ' + str_data + ' / ' + str_hora,
    };


    if(responseObject[message.content]){
        message.channel.send(responseObject[message.content]);
    }

    if (message.author.bot) return;

    if (message.content.startsWith('' + PREFIX + 'ping')) {
        message.channel.sendMessage('Seu ping é de `' + Math.round(bot.pings) + ' ms`');
    }

    if(message.content.toLocaleLowerCase().startsWith('' + PREFIX + 'dado')){
        randomNumber = Math.floor(Math.random() * (99 - 1) + 1 );

        if(randomNumber){
            message.reply(randomNumber);
        }
    }

    if(message.member.roles.has(role.id) && message.content.startsWith("" + PREFIX + "delete")){
        msgDel = 5;
        let numberMessages = parseInt(msgDel);
        message.channel.fetchMessages({limit: numberMessages}).then(messages => message.channel.bulkDelete(messages));
        message.channel.sendMessage('5 ultimas msgs removidas');
    }

    if(!message.member.roles.has(role.id) && message.content.startsWith("" + PREFIX + "delete")){
        message.reply("Você não tem esse poder");
    }

    if (message.content === '' + PREFIX + 'avatar') {
        message.reply(message.author.avatarURL);
    }

    if (message.content.startsWith(""+ PREFIX +"tocar")) {
        const server = servers[message.guild.id];

        if(!args[1]){
            message.content.startsWith("Precisa de um link");
            return;
        }

        if(!message.member.voiceChannel){
            message.content.startsWith("Entre em um canal de voz");
            return;
        }

        if (message.channel.type !== 'text') return;

        if(!servers[message.guild.id]){
            servers[message.guild.id] = {queue: []}
        }

        server.queue.push(args[1]);

        if(!message.guild.voiceConnection) {
            message.member.voiceChannel.join().then(function (connection) {
                play(connection, message);
            });
        }
    }

    if (message.content.startsWith('' + PREFIX + 'pular')){

        var server = servers[message.guild.id];
        if(server.dispatcher) server.dispatcher.end();

    }

    if (message.content.startsWith('' + PREFIX + 'parar')){

        message.reply("Parou de tocar");
        if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();

    }
});

bot.on('guildMemberAdd', member => {

    const channel = member.guild.channels.find(ch => ch.name === principal);

    if (!channel) return;

    channel.send(`Bem-vindo ao grupo, ${member}`);
});

