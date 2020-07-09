const {db} = require ("../db.js");
const {global} = require ("../global.js");
const {utils} = require("../utils.js");
const { expect } = require("chai");
const { info } = require("../set-before-test.js");
const agileService = require("agile-os-interface")

var localDB = null

describe("Add a local resource tests", function(){

    this.timeout(30000)

    before(async function(){
        //salva database locale
        localDB = await new Promise(function(resolve, reject){
            agileService.getConnections(null, (err,res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    })

    beforeEach(async function(){
        //cambia database locale
        await new Promise(function(resolve, reject){
            agileService.setConnections(null, (err,res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
        await utils.start()
    }) 

    afterEach(async function(){
        await new Promise(function(resolve, reject){
            agileService.setConnections(localDB, (err,res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
        await global.app.stop()
    })

    const rightValues = [
        {name: "local_app", info: "app"}
    ]
    rightValues.forEach(element => {
        if(info.os != "l"){
            it("should return true if a local application has been added", async () => {
                expect(await utils.resources.addLocalApplication(element.name, element.info)).to.be.true
            })
    
            if(info.os == "w"){
                it("should return true if the application has been added and success notification appeared", async () => {
                    var add = null
                    var notification = null
                    add = await utils.resources.addLocalApplication(element.name, element.info)
                    await utils.sleep(500)
                    notification = await utils.checkSuccessNotification()
                    expect(add && notification).to.be.true
                })
            }
    
            it("should return true if the application has been added and is now in the Agile list", async () => {
                var add = null
                var check = null
                add = await utils.resources.addLocalApplication(element.name, element.info)
                await utils.sleep(500)
                check = await utils.resources.isInAgileList(5, element.name)
                expect(add && check).to.be.true
            })
    
            if(info.os == "w"){
                it("should return true if the application has been added and is now in the Agile list, and success notification appeared", async () => {
                    var add = null
                    var notification = null
                    var check = null
                    add = await utils.resources.addLocalApplication(element.name, element.info)
                    await utils.sleep(500)
                    notification = await utils.checkSuccessNotification()
                    await utils.sleep(500)
                    check = await utils.resources.isInAgileList(5, element.name)
                    expect(add && notification && check).to.be.true
                })
            }
        }
        
    });

    const wrongValues = [
        {name: "any", info: "wrong"}
    ]
    wrongValues.forEach(element => {
        if(info.os != "l"){
            it("should return false if there is not any application to add with the given name", async () => {
                expect(await utils.resources.addLocalApplication(element.name, element.info)).to.be.false
            })
        }
    })
})