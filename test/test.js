var Application = require('spectron').Application;
const {global} = require ("./global.js");
const {db} = require ("./db.js");
const thinmanSettings = require ("./test-list/thinman-settings.js")
const general = require("./test-list/general.js")
const systemSettings = require("./test-list/system-settings.js")
const usbRedirection = require ("./test-list/usb-redirection.js")
const resources = require ("./test-list/resources.js")
const deviceLock = require("./test-list/device-lock.js")
const networkSettings = require("./test-list/network-settings.js");

//da impostare prima di eseguire
//path per la cartella Praim/Agile
const AGILE_PATH = "C:\\Program Files (x86)\\Praim\\Agile"

//apre l'applicazione prima di iniziare il test
before(function(done) {
    global.app = new Application({
        path: AGILE_PATH + '\\AgileConfigurator\\AgileConfigurator.exe',
    });
    //global.app.start();
    done();
});

//chiude l'applicazione alla fine dei test
// after(function (done) {
//     if (app && app.isRunning()) {
//         app.stop();
//     }
//     done();
// });


describe("TEST", function () {
    this.timeout(3000000)
    //pausetta tra i vari test
    beforeEach(function(done){
        this.timeout(5000);
        setTimeout(done,4000);
    })

    before(async function(){    
        //connessione al database
        db.dbConnection();
        //aggiorno la lingua in base a quella del db
        global.language = await db.dbLanguage();
    })


    //INSERIRE QUI I TEST
resources.addResource()


});