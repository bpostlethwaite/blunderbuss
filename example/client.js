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
