const CDP = require('chrome-remote-interface');
const chalk = require('chalk');

// Gather all Domains who have an "enable" method for notifications
var domains = []
CDP.Protocol(function (err, protocol) {
    if (!err) {
        protocol.descriptor.domains.forEach((d) => {
            if(d.commands.find(n => n.name === 'enable') !== undefined){
                domains.push(d.domain)
            }
        });
    }
});

CDP((client) => {

    // Enable notifications from all domains
    domains.forEach(d => {
        client[d].enable();
    })

    client.on('event', (e) => {
        console.log(chalk`{blue From target:} {green ${e.method}}`)
        console.log(`${JSON.stringify(e, null, '\t')}`);
    })

}).on('error', (err) => {
    console.error(err);
});