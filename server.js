const express = require('express')
const https = require('https')
const fs = require('fs')
const app = express()


let creds = {};
if (process.platform == "win32") {
   creds = {key: fs.readFileSync('server.key'), cert:fs.readFileSync('server.cert')}
} else {
    creds = {key: fs.readFileSync('/etc/letsencrypt/live/jakebs.xyz/key.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/jakebs.xyz/cert.pem'),
            ca: fs.readFileSync('/etc/letsencrypt/live/jakebs.xyz/fullchain.pem')
            }    
}

const httpsServer = https.createServer(creds, app)
const port = 443

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

    if (req.body.text == "imogen") {
        res.redirect('/#Sf')
    } else {
        res.redirect('/')
    }

    /* if (bordersActive == 1) {
        bordersActive = 0
    } else {
        bordersActive = 1
    } */
    
    //res.render('index', {borderOn: bordersActive})

})

httpsServer.listen(process.env.PORT || 443, () => {
    if (process.env.PORT == undefined) {
        console.log("Server now listening on PORT:443")
    } else {
        console.log(`Server now listening on PORT:${process.env.PORT}`)
    }
    
})

/* app.listen(80) */