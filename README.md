blunderbuss
============
```
                                            ?+
                                           ..7.     ?
                                           =78O=+O   ~
                                           .I$Z.     ,=                                                  ,+??I?IO
                                            I$Z7II$$Z+O87:+.++++++++++++++++++++++++++++++++++++++++++O:I:::,?~O??
                                           I$ZO$7.IIO?7Z$$~.77$$$777777I7777777I777I77$$$$7$77777777$$$?Z7I???IOII
                                       .OZ$?.?+~7:?,.Z..$+ ~8.?II7II7I7I77III7III7I77II7$77777777777$ZD?I????$?7I
                 ..77$ZZZ$$Z7.      ZIIOO$Z  .~?I=$?.: ~.$77II7Z.77$I77$7777I77$+==ZZ~~~:,,,77+?.Z$$ZZ??????????Z
   .77$$$ZZZZZZ$$7$$$7$$7$$$$$7Z87+8Z88OZ$$?=+=8OZZ$$7$$$ZZ$ZZZ7Z$7ZZ7$ZZ$$$Z$$+7:7I==IO7?$++=N?I$$$7:::::~=+~..
  $$$$7$$$7777$77I$$77$7$$7$$O8Z$8O8Z7Z$7Z$ZZZZZZZZZZZ$OZ$$$777$$$$$$$$$Z$$$$$+++++==+=+++++==+==~:...    ....
 .$$$$777$777$$$7$777777$7$O888$87ZOOO$7ZOOD?II=II.???+++==~~:::,::::~~~=~~:,......... ...........
 =$$$$7$$$7$$77$$$7$7777$Z8OZ$OO7II?77ZI+:~I+++:~~:I..
 O$Z7$$$7$$7777$7$7Z77ZD88$$$OZI?7ZN?++=~:I$...I...~
.:Z7$$$$77$$7$$$$$$$OD8DOIZ$$7$Z:?+~,..  .. I?:+?+
..O$ZOZ$$$$$7ZZZO$ZZZZ88Z$$Z8??=:..
..ZZZ$ZZZ$7ZZZZZZZZ$ZDOO8$+=~,.
.,Z$$OZOZZOZZZZZOZZOZ7+~:..
.ZZ$ZO8OZZZZZZZZZ$+=:,.
.OOO$Z$Z$ZZOZZ=+~...
ZZZZZZOZZZ++~,..
OZOOZZ$+=:,..
Z$=++~,...
.....
```
Blunderbuss is a [Connect](https://github.com/senchalabs/connect) like middleware system for stacking together distributed services. This is accomplished with [Substack's DNode](https://github.com/substack/dnode) project to pass data between services and client. Event emitters pass data between the client facing service API's within Blunderbuss. Easy start and finish functions allow for pre and post logic as well as creating circular service chains for repetitive or additive tasks.

The only requirement is that each dnode server instance has a single function named `service`.

## Example
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

## Install
```shell
$ npm install blunderbuss
```
