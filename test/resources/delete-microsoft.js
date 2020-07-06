const {db} = require ("../db.js");
const {global} = require ("../global.js");
const {utils} = require("../utils.js");
const { expect } = require("chai");
var localDB = null

describe("delete microsoft resource tests", function(){

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
        db.conn.set("connections", "[{\"name\":\"test\",\"type\":\"RDP\",\"autostart\":false,\"onExitAction\":\"\",\"passthrough\":false,\"local\":false,\"server\":false,\"options\":{\"allow_unauthorized\":false,\"file\":\"//long_string==\",\"filename\":\"microsoft_test.rdp\"},\"id\":\"24a97819-b4ef-4d19-a137-7c6287fe75c5\"}]")
        await utils.start()
    }) 

    afterEach(async function(){
        db.conn.set("connections", localDB)
        await global.app.stop()
    })

    it("should return true if a resource is deleted", async () => {
        expect(await utils.resources.deleteResource("test")).to.be.true
    })

    it("should return false if it tries to delete a resource that does not exist", async () => {
        expect(await utils.resources.deleteResource("wrong_name")).to.be.false
    })

    it("should return true if a resource is deleted and is not in the database anymore", async () => {
        var del = null
        var check = null
        del = await utils.resources.deleteResource("test")
        await utils.sleep(1000)
        check = await db.getResourceFromName("test")
        expect(del && check == null).to.be.true
    })

    it("should return true if a resource is deleted and is not in the list anymore", async () => {
        var del = null
        var found = false;
        del = await utils.resources.deleteResource("test")
        await utils.sleep(500)
        found = await utils.resources.isInAgileList(2, "test", "microsoft_test")
        expect(del && found == false).to.be.true
    })

    it("should return true if a resource is deleted and the success notification appeared", async () => {
        var del = null
        var notification = null;

        del = await utils.resources.deleteResource("test")
        
        await utils.sleep(1000)

        notification = await utils.checkSuccessNotification()
        expect(del && notification).to.be.true
    })
})