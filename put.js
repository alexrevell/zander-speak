var level = require('level')

var db = level('./test')

db.put('hello', 'world', function (err) {
  if (err) {
    console.log('Ooops!', err)
  }
  console.log("successfully set data")
})
