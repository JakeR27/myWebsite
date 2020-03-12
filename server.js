const express = require('express')
const https = require('https')
const fs = require('fs')
const app = express()

let bordersActive = 0

console.log("Server running")

app.set('view engine', 'ejs')
app.set('trust proxy', 'loopback')

app.use('/media', express.static(__dirname + '/media'));
app.use(express.urlencoded({extended: false}))
app.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ))

app.get('/', (req, res) => {
    res.render('index', {borderOn: bordersActive})
    console.log(`served request from ${req.ip}`)
})

app.get('/dev', (req, res) => {
    res.render('index', {borderOn: 1})
})

app.post('/submitButton', (req, res) => {

    if (req.body.text == "d") {
        bordersActive = 1
    } else {
        bordersActive = 0
    }

    /* if (bordersActive == 1) {
        bordersActive = 0
    } else {
        bordersActive = 1
    } */
    res.redirect('/')
    //res.render('index', {borderOn: bordersActive})

})

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app).listen(process.env.PORT || 5000, () => {
    console.log(`Server now listening on ${process.env.PORT}`)
})

//app.listen(process.env.PORT || 5000)