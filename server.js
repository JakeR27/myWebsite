//All imports here 
const express = require('express')
const https = require('https')
const http = require('http')
const fs = require('fs')
const childProcess = require('child_process')
const cookieParser = require('cookie-parser')
const httpsApp = express()
const httpApp = express()

//set SSL files based on which OS is hosting the server
let creds = {};
if (process.platform == "win32") {
   creds = {key: fs.readFileSync('server.key'), cert:fs.readFileSync('server.cert')}
} else {
    creds = {key: fs.readFileSync('/etc/letsencrypt/live/jakebs.xyz/privkey.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/jakebs.xyz/cert.pem'),
            ca: fs.readFileSync('/etc/letsencrypt/live/jakebs.xyz/fullchain.pem')
            }    
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
console.log("WEB: server starting")

//Redirect all http requests to https server
httpApp.get('*', (req, res) => {
    if (req.subdomains[0] == undefined) {
        res.redirect("https://" + req.headers.host + req.url);
        console.log("WEB HTTP: redirect to https server")
    } else {
        res.redirect("https://" + req.subdomains[0] + req.headers.host + req.url);
        console.log("WEB HTTP: redirect to https server")
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
    console.log(`served request from ${req.ip}`)
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
    let sender = req.body.sender
    let branch = req.body.ref

    //if push was to master and the user was me then
    if (branch.indexOf('master') > -1 && sender.login === githubUser) {
        redeploy(res)
    }
})

// starts httpS server at port 443
httpsServer.listen(process.env.PORT || httpsPort, () => {
    if (process.env.PORT == undefined) {
        console.log(`WEB HTTPS: server listening on PORT:${httpsPort}`)
    } else {
        console.log(`WEB HTTPS: server listening on PORT:${process.env.PORT}`)
    }
    
})

// starts http server at port 80 
httpServer.listen(80, () => {
    console.log("WEB HTTP: server listening on PORT:80")
})

// function to reploy this server
function redeploy(res) {
    //this runs a commandline and starts the "deployserver" script
    childProcess.exec('cd ~/myWebsite && deployServer', (err, stdout, stderr) => {
        //if there was an error show it here
        if (err) {
            console.error(err)
            return res.send(500)
        }
        res.send(200)
    })
}

/* app.listen(80) */