const { http } = require('./initialize')

http.listen(3000, () =>{
    console.log('listening on *:3000')
})