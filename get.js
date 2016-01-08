var level = require('level')

var db = level('./test')

db.get('hello', function (err, value) {
  if (err) {
    console.log('Ooops!', err)
  }
  console.log("name = ", value)
})
