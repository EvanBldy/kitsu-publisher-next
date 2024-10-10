include(globals.packageFolder + '/openHarmony.js')

function HTTPDaemon(parent) {
  QTcpServer.call(this, parent)

  this.start = function (portIntervalMin, portIntervalMax) {
    if (portIntervalMin === undefined) {
      portIntervalMin = 10000
    }
    if (portIntervalMax === undefined) {
      portIntervalMax = 10099
    }
    for (var port = portIntervalMin; port <= portIntervalMax; port++) {
      if (this.listen(QHostAddress.Any, port)) {
        $.log('INFO:  Server is listening')
        $.log('INFO:  Server is running on http://0.0.0.0:' + String(port))
        return
      }
    }
    $.log(
      'Cannot find a free port in the range [' +
        String(portIntervalMin) +
        '...' +
        String(portIntervalMax) +
        ']'
    )
  }

  this.disabled = false

  this.pause = function () {
    this.disabled = true
  }

  this.resume = function () {
    this.disabled = false
  }

  this.lock = false

  this.routes = {}

  this.add_route = function (route, methods, afunction) {
    this.routes[route] = { methods: methods, afunction: afunction }
  }

  this.readClient = function () {
    if (this.disabled) {
      return
    }

    $ = globals.$
    oNode = globals.$.oNode

    try
    {
      if (this.socket.canReadLine()) {
        status_line = this.socket.readLine().toString().trim()
        status_line_split = status_line.split(' ')

        request = {
          method: status_line_split[0],
          url: new QUrl(status_line_split[1]),
          protocol: status_line_split[2]
        }

        log = 'INFO:  "' + status_line + '" '

        if( !request.url.path )
        {
          var regex = /^(https?:\/\/[^\/]+)?(\/[^?]*)?(\?.*)?$/
          var matches = status_line_split[1].match( regex )

          $.log(matches)

          request.url.path = function()
          {
            return matches.length <= 2 ? "" : matches[2]
          }

          request.url.query = function()
          {
            return matches.length <= 3 ? "" : matches[3]
          }

          request.url.queryItemValue = function(item)
          {
            if ( !matches.length <= 3) {
              items = matches[3].substring(1).split("&")
              for (var n = 0; n < items.length; n++) {
                var itemValue = items[n].split("=")
                if (itemValue[0] == item) {
                  return decodeURIComponent(itemValue[1])
                }
              }
            }
            return ""
          }

        }

        //There are missing tools in QUrl bindings in Harmony 22+, using a regexp to replace those for now.
        if (this.routes.hasOwnProperty(request.url.path())) {
          if (
            this.routes[request.url.path()]['methods'].indexOf(request.method) >=
            0
          ) {
            try {
              result = this.routes[request.url.path()]['afunction'](
                request.method,
                request.url
              )
              this.socket.write(new QByteArray('HTTP/1.1 200 Ok\r\n'))
              log = log + '200 OK'
            } catch (e) {
              result = { detail: e.name + ' : ' + e.message }
              $.log('ERROR:  "' + e.name + ' : ' + e.message)
              if (e instanceof globals.HTTPExceptions.MissingQueryError) {
                this.socket.write(
                  new QByteArray('HTTP/1.1 422 Unprocessable Entity\r\n')
                )
                log = log + '422 Unprocessable Entity'
              } else {
                this.socket.write(
                  new QByteArray('HTTP/1.1 500 Internal Server Error\r\n')
                )
                log = log + '500 Internal Server Error'
              }
            }
          } else {
            this.socket.write(new QByteArray('HTTP/1.1 501 Not Implemented\r\n'))
            log = log + '501 Not Implemented'
            result = { detail: 'Not Implemented' }
          }
        } else {
          this.socket.write(new QByteArray('HTTP/1.1 404 Not Found\r\n'))
          log = log + '404 Not Found'
          result = { detail: 'Not Found' }
        }

        this.socket.write(
          new QByteArray('Content-Type: application/json; charset="utf-8"\r\n')
        )
        this.socket.write(new QByteArray('\r\n'))
        this.socket.write(new QByteArray(JSON.stringify(result)))

        $.log(log)

        this.socket.close()

        if (this.socket.state() == QAbstractSocket.UnconnectedState) {
          this.socket.deleteLater()
        }

        this.lock = false
      }
    }
    catch(err)
    {
      MessageLog.trace( "ReadClient Error: " + err)
    }
  }

  this.discardClient = function () {
    this.socket.deleteLater()
  }

  this.setTimeout = function (fc) {
    timer = new QTimer()
    timer.interval = 300
    timer.singleShot = true
    timer.timeout.connect(this, function () {
      fc.call()
    })
    timer.start()
  }

  this.waitForLock = function () {
    if (this.lock === true) {
      this.setTimeout(this.waitForLock)
    }
    return
  }

  var hasIncomingConnectionOverride = this.incomingConnection !== undefined

  this.incomingConnection = function (socket) {
    if (this.disabled) {
      return
    }
    if (this.lock === true) {
      this.waitForLock()
    }
    this.lock = true
    this.socket = new QTcpSocket(this)
    this.socket.readyRead.connect(this, 'readClient')
    this.socket.disconnected.connect(this, 'discardClient')
    this.socket.setSocketDescriptor(socket)
  }

  if( !hasIncomingConnectionOverride )
  {
    var localServerBind = this
    this.acceptNewConnection = function()
    {
      try
      {
        socket = localServerBind.nextPendingConnection()

        localServerBind.socket = socket

        socket.readyRead.connect( localServerBind, 'readClient' )
        socket.disconnected.connect( localServerBind, 'discardClient' )
      }
      catch(err)
      {
        MessageLog.trace( "New Connection Error: " + err )
      }
    }
    this.newConnection.connect( this.acceptNewConnection )
  }
}

HTTPDaemon.prototype = Object.create(QTcpServer.prototype)
HTTPDaemon.prototype.constructor = HTTPDaemon

exports.HTTPDaemon = HTTPDaemon
this.__proto__.HTTPDaemon = HTTPDaemon
