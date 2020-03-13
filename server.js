const express = require('express')
const https = require('https')
const http = require('http')
const fs = require('fs')
const httpsApp = express()
const httpApp = express()


let creds = {};
if (process.platform == "win32") {
   creds = {key: fs.readFileSync('server.key'), cert:fs.readFileSync('server.cert')}
} else {
    creds = {key: fs.readFileSync('/etc/letsencrypt/live/jakebs.xyz/privkey.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/jakebs.xyz/cert.pem'),
            ca: fs.readFileSync('/etc/letsencrypt/live/jakebs.xyz/fullchain.pem')
            }    
}

const httpsServer = https.createServer(creds, httpsApp)
const httpServer = http.createServer(httpApp)

const httpsPort = 443

let bordersActive = 0

console.log("Server running")

httpApp.get('*', (req, res) => {
    res.redirect("https://" + req.headers.host + req.url);
    console.log("HTTP: redirect to https")
})

httpsApp.set('view engine', 'ejs')
httpsApp.set('trust proxy', 'loopback')

httpsApp.use('/media', express.static(__dirname + '/media'));
httpsApp.use(express.urlencoded({extended: false}))
httpsApp.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ))

httpsApp.get('/', (req, res) => {
    res.render('index', {borderOn: bordersActive})
    console.log(`served request from ${req.ip}`)
})

httpsApp.get('/dev', (req, res) => {
    res.render('index', {borderOn: 1})
})

httpsApp.post('/submitButton', (req, res) => {

    if (req.body.text == "d") {
        bordersActive = 1
    } else {
        bordersActive = 0
    }

    if (req.body.text == "test") {
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

httpsServer.listen(process.env.PORT || httpsPort, () => {
    if (process.env.PORT == undefined) {
        console.log("HTTPS: server listening on PORT:443")
    } else {
        console.log(`HTTPS: server listening on PORT:${process.env.PORT}`)
    }
    
})

httpServer.listen(80, () => {
    console.log("HTTP: server listening on PORT:80")
})



/* app.listen(80) */