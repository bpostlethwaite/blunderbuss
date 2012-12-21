var dnode = require('dnode')
/*
 * Define service functions.
 * These would usually be distributed
 * over processes or machines etc.
 */
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

