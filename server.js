//All imports here 
const express = require('express')
const https = require('https')
const http = require('http')
const fs = require('fs')
const childProcess = require('child_process')
const cookieParser = require('cookie-parser')
const httpsApp = express()
const httpApp = express()
const dateObject = new Date()

//set SSL files based on which OS is hosting the server
let creds = {};
try {
    creds = {key: fs.readFileSync('/etc/letsencrypt/live/jakebs.xyz/privkey.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/jakebs.xyz/cert.pem'),
            ca: fs.readFileSync('/etc/letsencrypt/live/jakebs.xyz/fullchain.pem')
        }
} catch(err) {
    creds = {key: fs.readFileSync('server.key'), 
            cert:fs.readFileSync('server.cert')}
}

//Create the server
const httpsServer = https.createServer(creds, httpsApp)
const httpServer = http.createServer(httpApp)

//Set variables to use later
const httpsPort = 8443
const httpPort = 8080
const githubUser = "JakeR27"
let bordersActive = 0

//Notify server is startinh
console.log(cTime() + "WEB: server starting")

//Redirect all http requests to https server
httpApp.get('*', (req, res) => {
    if (req.subdomains[0] == undefined) {
        res.redirect("https://" + req.headers.host + req.url);
        console.log(cTime() + "WEB HTTP: redirect to https server")
    } else {
        res.redirect("https://" + req.subdomains[0] + req.headers.host + req.url);
        console.log(cTime() + "WEB HTTP: redirect to https server")
    }
    
})

//Set https server settings
httpsApp.set('view engine', 'ejs')
httpsApp.set('trust proxy', 'loopback')

httpsApp.use(express.urlencoded({extended: false}))
httpsApp.use(cookieParser())

//Set https server directories
httpsApp.use('/media', express.static(__dirname + '/media'));
httpsApp.use(express.static(__dirname + '/static', { dotfiles: 'allow' } ))

//Root path displays site
httpsApp.get('/', (req, res) => {

    //If devMode cookie present show dev render
    if (req.cookies['devMode'] == 'true') {
        res.render('index', {borderOn: 1})
    } else { //Otherwise show normal render and reset cookie
        res.cookie('devMode','false')
        res.render('index', {borderOn: 0})
        
    }
    
    //Log the IP of the request
    console.log(cTime() + `HTTPS: served request from ${req.ip}`)
})

// /dev path sets the devMode cookie
httpsApp.get('/dev', (req, res) => {
    res.cookie('devMode', 'true')
})

// post handler for when search button is pressed
httpsApp.post('/submitButton', (req, res) => {

    //if "d" was typed then setup dev mode, otherwise remove it
    if (req.body.text == "d") {
        res.cookie('devMode', 'true')
    } else {
        res.cookie('devMode', 'false')
    }

    //if "test" was typed then redirect to lower down the page
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

// post handler for a github push update
httpsApp.post('/webhooks/github/push', (req, res) => {
    console.log(cTime() + 'WEB HTTPS: github push recieved')
    let sender = req.body.sender
    let branch = req.body.ref
    console.log(cTime() + req)
    console.log(cTime() + "--------------------------------------------------------------------------------------------------------------")
    console.log(cTime() + req.body)

    //if push was to master and the user was me then
    if (branch.indexOf('master') > -1 && sender.login === githubUser) {
        console.log(cTime() + 'WEB HTTPS: github branch and user ok, attemping to redeploy')
        redeploy(res)
    }
})

// starts httpS server at port 8443 by default 
httpsServer.listen(process.env.httpsPORT || httpsPort, () => {
    if (process.env.httpsPORT == undefined) {
        console.log(cTime() + `WEB HTTPS: server listening on PORT:${httpsPort}`)
    } else {
        console.log(cTime() + `WEB HTTPS: server listening on PORT:${process.env.httpsPORT}`)
    }
    
})

// starts http server at port 8080 by default
httpServer.listen(process.env.httpPORT || httpPort, () => {
    if (process.env.httpPORT == undefined) {
        console.log(cTime() + `WEB HTTP: server listening on PORT:${httpPort}`)
    } else {
        console.log(cTime() + `WEB HTTP: server listening on PORT:${process.env.httpPORT}`)
    }
})

// function to reploy this server
function redeploy(res) {
    console.log(cTime() + 'attemping to run redeploy commands')
    //this runs a commandline and starts the "deployserver" script
    childProcess.exec('cd ~/myWebsite && deployServer', (err, stdout, stderr) => {
        //if there was an error show it here
        if (err) {
            console.error(cTime() + err)
            return res.send(500)
        }
        res.send(200)
    })
}

function cTime() {
    let h = dateObject.getHours()
    let m = dateObject.getMinutes()
    let s = dateObject.getSeconds()

    return (h + ":" + m + ":" + s)
}
/* app.listen(80) */