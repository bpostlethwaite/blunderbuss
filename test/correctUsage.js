var ss = require("../")()
  , dnode = require('dnode')


/************************************/
// Define Service Functions
function doubleIt(json, cb) {
  json.data *= 2
  cb(null, json)
}
function dupField(json, cb) {
  json.data2 = json.data
  cb(null, json)
}
function sumFields(json, cb) {
  json.total = json.data2 + json.data
  cb(null, json)
}

/************************************/
// Start Service Servers
var server = dnode({
    service : doubleIt
})
server.listen(5001)
var server2 = dnode({
    service : dupField
})
server2.listen(5002)
var server3 = dnode({
    service : sumFields
})
server3.listen(5003)
/************************************/
// Service Stack

var services = {
  "doubleIt": 5001
, "dupField": 5002
, "sumFields": 5003
}


ss.register(services)
//ss.logger(false)
ss.start({"data": 2})
var rep = 0
ss.finish(function (data) {
  rep++
  if (rep === 5)
    process.exit(1)
  console.log("service chain complete, data is:", data)
  ss.start(data)
})
