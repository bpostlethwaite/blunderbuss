var ss = require("../")()
  , dnode = require('dnode')



function doubleIt(json, cb) {
  json.data *= 2
  console.log(json.data)
  cb(null, json)
}
function dupField(json, cb) {
  json.data2 = json.data
  console.log(json.data2)
  (null, json)
}
function sumFields(json, cb) {
  json.total = json.data2 + json.data
  console.log(json.total)
  cb(null, json)
}

/************************************/
//Start Servers
var server = dnode({
    service : doubleIt
})
server.listen(5001)
console.log("listening on 5001")
var server2 = dnode({
    service : dupField
})
server2.listen(5002)
console.log("listening on 5002")
var server3 = dnode({
    service : sumFields
})
server3.listen(5003)
console.log("listening on 5003")
/************************************/


var services = {
  "doubleIt": 5001
, "dupField": 5002
, "sumFields": 5003
}


ss.register(services)
//ss.logger(false)
ss.start({"data": 2})
