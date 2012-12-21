var ss = require("../")()
  , dnode = require('dnode')
  , test = require("tape")

/************************************/
// Define Service Functions
function doubleIt(data, cb) {
  data.data *= 2
  cb(null, data)
}

function divideByZero(data, cb) {
  data.data2 = data.data / 0
  if (typeof data.data2 !== 'number' || isNaN(data.data2) || !isFinite(data.data2) )
    var err = new Error("datatype is not number")
  cb(err, data)
}

function sumFields(data, cb) {
  data.total = data.data2 + data.data
  cb(null, data)
}

/************************************/
// Start Service Servers
var server = dnode({
    service : doubleIt
})
server.listen(5001)
var server2 = dnode({
    service : divideByZero
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
ss.finish(function (data) {
  console.log(data)
  process.exit(1)
})