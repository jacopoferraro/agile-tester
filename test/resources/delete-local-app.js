const {db} = require ("../db.js");
const {global} = require ("../global.js");
const {utils} = require("../utils.js");
const { expect } = require("chai");
var localDB = null

describe("delete local application tests", function(){

    this.timeout(30000)

    before(async function(){
        //salva database locale
        db.conn.select(1)
        localDB = await new Promise(function (resolve, reject){
            db.conn.get("connections", function(err, res){
                if(err) reject(err)
                resolve(res)
            });
        })
    })

    beforeEach(async function(){
        //cambia database locale
        db.conn.set("connections", "[{\"name\":\"app_test\",\"type\":\"APP\",\"autostart\":false,\"onExitAction\":\"\",\"passthrough\":false,\"local\":true,\"server\":false,\"options\":{\"path\":\"C:\\\\percorso\\\\app_test.exe\",\"filename\":\"app_test.exe\",\"args\":\"\",\"domain\":\"\",\"hideDomain\":false,\"exclude\":{\"name\":[],\"type\":[]}},\"id\":\"18a4df02-ddad-40af-8e1d-3fa31852d9f6\"}]")
        await utils.start()
    }) 
    
    afterEach(async function(){
        db.conn.set("connections", localDB)
        await global.app.stop()
    })

    it("should return true if a resource is deleted", async () => {
        expect(await utils.resources.deleteResource("app_test")).to.be.true
    })

    it("should return null if it tries to delete a resource that does not exists", async () => {
        expect(await utils.resources.deleteResource("wrong_name")).to.be.null
    })

    it("should return true if a resource is deleted and is not in the database anymore", async () => {
        var del = null
        var check = null
        del = await utils.resources.deleteResource("app_test")
        await utils.sleep(1000)
        check = await db.getResourceFromName("app_test")
        expect(del && check == null).to.be.true
    })

    it("should return true if a resource is deleted and is not in the list anymore", async () => {
        var del = null
        var found = false;
        del = await utils.resources.deleteResource("app_test")
        await utils.sleep(500)
        found = await utils.resources.isInAgileList(5, "app_test", "app_test")
        expect(del && found == false).to.be.true
    })

    it("should return true if a resource is deleted and the success notification appeared", async () => {
        var del = null
        var notification = null;

        del = await utils.resources.deleteResource("app_test")
        
        await utils.sleep(1000)

        notification = await utils.checkSuccessNotification()
        expect(del && notification).to.be.true
    })
})