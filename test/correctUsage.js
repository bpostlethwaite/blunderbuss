var ss = require("../")()
  , dnode = require('dnode')
  , test = require('tape')


test('Correct Value through cyclic service stack', function (t) {
  var totalrep = 4
  t.plan(totalrep)
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
  ss.start({"data": 1})


  var rep = 0
  ss.finish(function (data) {
    rep++
    t.same( data
          , {
            data: Math.pow(2,rep)
          , data2: Math.pow(2,rep)
          , total: Math.pow(2,rep) + Math.pow(2,rep)
          })
    if (rep === totalrep) {
      t.end()
      process.exit(1)
    }
    ss.start(data)
  })

})