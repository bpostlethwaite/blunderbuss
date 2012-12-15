/*
 * Service Stack
 * Some funky connect like stack, except using
 * dnode and streaming services.
 *
 */
var dnode = require('dnode')
  , winston = require('winston')
  , EventEmitter = require('events').EventEmitter




module.exports = function () {

  var that = {}
    , ev = new EventEmitter
    , eventqueue = []

  that.stack = []
  that.count = 0
  that.ready = false


  function logger(service, bool) {
    /*
     * Turns on logging, eventually
     * add functionality to customize
     * Winston through this interface
     * Or just expose winston directly.
     */
    if(typeof service === "boolean")
      that.log = service
    else
      that.service.log = bool
  }

  function log(service, data) {
    /*
     * log data through winston
     */
    winston.info(service, data)
  }

  function handle(service, err) {
    /*
     * handle errors
     */
    if (that.log)
      log(service, err)
    console.error("error in", service, err)
    throw err
  }

  function next(service, data) {
    /*
     * Find service name in list and return
     * next name as an event, so listener
     * can proceed.
     */
    var nextService = null
      , i

    i = that.stack.indexOf(service)
    if (i >= 0) {
      i += 1 // shift for next serice
      if(i === that.stack.length)
        nextService = "finish"
      else
        nextService =  that.stack[i]
    }
    ev.emit(nextService, data)
  }

  function servicecount() {
    that.count++
    if (that.count === that.stack.length) {
      that.ready = true
    }
  }

  function register(serviceObj) {
    /*
     * Register the dnode services and
     * remove all previous listeners before
     * constructing new ones.
     */
    if (that.stack.length > 0)
      ev.removeAllListener(that.stack)

    that.stack = Object.keys(serviceObj)
    that.stack.forEach( function (service) {
      that[service] = {}
      that[service].name = service
      that[service].d = dnode.connect(serviceObj[service])
    })

    /*
     * Run through each service and set up event handlers
     * to work in a chain, and set up remote dnode functions
     * to accept data from events, operate on data and then
     * emit data to next service.
     */
    that.stack.forEach( function (service) {
      that[service].d.on("remote", function(remote) {
        servicecount()
        ev.on( service, function (data) {
          remote.service(data, function (err, data) {
            if (err) return handle(service, err)
            if (that.log)
              log(service, data)
            next(service, data)
          })
        })
      })
    })
  }

  function start(data) {
    /*
     * Initiate service chain with data.
     * If event listeners not yet established
     * try on next tick.
     */
    function holdstart () {
      if(!data)
        data = {}
      if(that.ready)
        ev.emit( that.stack[0], data)
      else
        process.nextTick(holdstart)
    }
    holdstart()
  }

  function finish(cb) {
    /*
     * Allow user to supply a callback
     * on data at end of service chain.
     */
    ev.on("finish", cb)
  }

  that.register = register
  that.logger = logger
  that.start = start
  that.finish = finish

  return that

}
