const {db} = require ("../db.js");
const {global} = require ("../global.js");
const {utils} = require("../utils.js");
const { expect } = require("chai");
const agileService = require("agile-os-interface")

var localDB = null

describe("Check add usb redirection rule", function(){

    this.timeout(30000)

    before(async function(){
        //salva database locale
        localDB = await new Promise(function(resolve, reject){
            agileService.getCitrixConfig(null, (err,res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    })

    beforeEach(async function(){
        //cambia database locale
        db.conn.select(1)
        db.conn.set("config_citrix", "{\"usb_redirection\":{\"auto_redirect_on_start\":true,\"auto_redirect_on_plug\":false,\"rules\":[{\"type\":\"ALLOW\",\"vid\":\"1234\",\"pid\":\"1234\",\"class\":\"\",\"subclass\":\"\",\"prot\":\"\",\"description\":\"prova_usb\",\"split\":false,\"interfaces\":[]}],\"default\":\"ALLOW\"}}")
        
        console.log(await new Promise(function(resolve, reject){
            agileService.getCitrixConfig(null, (err,res) => {
                if (err) reject(err)
                resolve(res)
            })
        }))
        await utils.start()
    }) 

    afterEach(async function(){
        db.conn.select(1)
        db.conn.set("config_citrix", localDB)
        await global.app.stop()
    })

    it("should return true if the rule is in the database", async () => {
        const usb = await db.getUSBFromVidPid(1234,1234)
        expect(usb != null && usb.description == "prova_usb").to.be.true
    })

    it("should return true if the rule is in the Agile list", async () => {
        expect(await utils.usbRedirection.findRule(1234, 1234)).to.be.true
    })

    it("should return false if it tries to add a rule with same vid and pid of another rule", async () => {
        expect(await utils.usbRedirection.addRule("any", 1234, 1234)).to.be.false
    })

})