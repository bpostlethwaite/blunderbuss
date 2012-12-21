blunderbuss
============

Blunderbuss is a [Connect](https://github.com/senchalabs/connect) like middleware system for stacking together distributed services that pass data via event emitters. This is accomplished with [Substack's DNode](https://github.com/substack/dnode) project to pass data between services and client. Event emitters pass data between the client facing service API's within Blunderbuss. Easy start and finish functions allow for pre and post logic as well as creating circular service chains for repetitive or additive tasks.

On the `Server` service, do:
```javascript
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
```

Though you would usually want to define
these services independently in their own
processes or machines.

On the `Client`, do:
```javascript
var ss = require("../")()

var services = {
  "doubleIt": 5001
, "dupField": 5002
, "sumFields": 5003
}


ss.register(services)
ss.start({"data": 1})

var totalrep = 3
var rep = 0

/*
 * Calling ss.start in the finish callback
 * and passing in the accumulated data
 * sets up a repetition for an assembly line
 * style service structure.
 */
ss.finish(function (data) {
  rep++
  console.log(data)
  if (rep === totalrep) {
    process.exit(1)
  }
  ss.start(data)
})
```

which outputs
```shell
{ data: 2, data2: 2, total: 4 }
{ data: 4, data2: 4, total: 8 }
{ data: 8, data2: 8, total: 16 }
```

