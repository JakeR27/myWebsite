//All imports here 
const express = require('express')
const https = require('https')
const http = require('http')
const fs = require('fs')
const util = require('util')
const childProcess = require('child_process')
const cookieParser = require('cookie-parser')
const colours = require('colors')
const gitHandler = require('github-webhook-middleware')({
    secret: "secret"
})
const httpsApp = express()
const httpApp = express()

//for console.log commands
const webS = "WEB ".cyan
const httpS = "HTTP ".red
const httpsS = "HTTPS ".green
const githubS = "GITHUB ".blue

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

//create log file
/* let logFile = fs.createWriteStream('/log.txt', {flags: 'w'})
let logStdout = process.stdout
console.log = (d) => {
    logFile.write(util.format(d) + '\n');
    //logStdout.write(util.format.apply(null, arguments) + '\n');
} */

//Notify server is startinh
console.log(cTime() + webS + ": server starting")

//Redirect all http requests to https server
httpApp.get('*', (req, res) => {
    if (req.subdomains[0] == undefined) {
        res.redirect("https://" + req.headers.host + req.url);
        
        console.log(cTime() + webS + httpsS + ": redirect to https server")
    } else {
        res.redirect("https://" + req.subdomains[0] + req.headers.host + req.url);
        console.log(cTime() + webS + httpS + ": redirect to https server")
    }

    console.log(req.headers.host + "  " + req.subdomains[0])
    console.log(req)
    
})

//Set https server settings
httpsApp.set('view engine', 'ejs')
httpsApp.set('trust proxy', 'loopback')

httpsApp.use(express.urlencoded({extended: false}))
httpsApp.use(cookieParser())

//Set https server directories
httpsApp.use('/media', express.static(__dirname + '/media'));
httpsApp.use('/client-side-js', express.static(__dirname + '/client-side-js'))
httpsApp.use(express.static(__dirname + '/static'))
httpsApp.use(express.static(__dirname + '/views'))

//log IP of all requests
httpsApp.use( (req, res, next) => {
    //Log the IP of the request
    console.log(cTime() + webS + httpsS + `: served ${req.method} request to ${req.url} from ${req.ip}`)
    next()
})

//redirect all not found pages to a 404 messagescreen 
httpsApp.use(function(req, res, next){
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {
      res.render('404', { url: req.url });
      return;
    }
  
    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }
  
    // default to plain-text. send()
    res.type('txt').send('Not found');
  });

//Root path displays site
httpsApp.get('/', (req, res) => {

    //If devMode cookie present show dev render
    if (req.cookies['devMode'] == 'true') {
        res.render('index', {borderOn: 1})
    } else { //Otherwise show normal render and reset cookie
        res.cookie('devMode','false')
        res.render('index', {borderOn: 0})
        
    }
})

//Root path displays site
httpsApp.get('/futureProjects', (req, res) => {

    res.render('futureProjects')
    
    //Log the IP of the request
    console.log(cTime() + webS + httpsS + `: served request from ${req.ip}`)
})

// /dev path sets the devMode cookie
httpsApp.get('/dev', (req, res) => {
    res.cookie('devMode', 'true')
})

//allow MMR tracker requests to work
httpsApp.get('/mmr', (req, res) => {
    res.render('mmrtracker', {borders: false})
})

httpsApp.get('/mmrDEV', (req, res) => {
    res.render('mmrtracker', {borders: true})
})

httpsApp.get('/tutor', (req, res) => {
    res.render('tutor')
})

httpsApp.get('/symptom-checker', (req, res) => {
    res.render('symptoms')
})


//funny gym meme with luke
httpsApp.get('/gym', (req, res) => {

    if (req.cookies["LukeIsCool"] == true) {
        res.cookie('LukeIsCool', 'false');
        res.render('gym', {lukeIsCool: true});
    } else {
        res.cookie('LukeIsCool', 'true');
        res.render('gym', {lukeIsCool: false});
    }
    
})

//post handler for luke being cool
httpsApp.post('/gym', (req, res) => {
        
    if (req.cookies["LukeIsCool"] == "true") {
        res.cookie('LukeIsCool', 'false');
        res.render('gym', {lukeIsCool: true});
    } else {
        res.cookie('LukeIsCool', 'true');
        res.render('gym', {lukeIsCool: false});
    }

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
httpsApp.post('/webhooks/github/push', gitHandler, (req, res) => {
    console.log(cTime() + webS + httpsS + githubS + ': push recieved')
    let sender = req.body.sender
    let branch = req.body.ref
    console.log(cTime() + webS + httpsS + req)
    console.log(cTime() + webS + httpsS + "--------------------------------------------------------------------------------------------------------------")
    console.log(cTime() + webS + httpsS + req.body)

    //if push was to master and the user was me then
    if (branch.indexOf('master') > -1 && sender.login === githubUser) {
        console.log(cTime() + webS + httpsS + githubS + ': branch and user ok')

        //if correct github event
        if (req.headers['x-github-event'] = 'push') {
            redeploy(res)
        }
        res.status(200).end()
    }
})

// starts httpS server at port 8443 by default 
httpsServer.listen(process.env.httpsPORT || httpsPort, () => {
    if (process.env.httpsPORT == undefined) {
        console.log(cTime() + webS + httpsS + `: server listening on PORT:${httpsPort}`)
    } else {
        console.log(cTime() + webS + httpsS + `: server listening on PORT:${process.env.httpsPORT}`)
    }
    
})

// starts http server at port 8080 by default
httpServer.listen(process.env.httpPORT || httpPort, () => {
    if (process.env.httpPORT == undefined) {
        console.log(cTime() + webS + httpS + `: server listening on PORT:${httpPort}`)
    } else {
        console.log(cTime() + webS + httpS + `: server listening on PORT:${process.env.httpPORT}`)
    }
})

// function to reploy this server
function redeploy(res) {
    console.log(cTime() + webS + ': attemping to fetch updated files from github')
    //this runs a commandline and starts the "deployserver" script
    //childProcess.exec('cd ~/myWebsite && deployServer', (err, stdout, stderr) => {
    childProcess.exec('cd /home/j_bailey_saltmarsh_google/Web3/myWebsite && git pull https://JakeR27:githubPassw0rd312@github.com/JakeR27/myWebsite', (err, stdout, stderr) => {
        //if there was an error show it here
        if (err) {
            console.error(cTime() + webS + err)
            return res.send(500)
        }
    })
    console.log(cTime() + webS + ": sucessfully ran redeploy command")
}

function cTime() {
    let dateObject = new Date()

    let h = dateObject.getHours()
    let m = dateObject.getMinutes()
    let s = dateObject.getSeconds()

    return (h + ":" + m + ":" + s + " ").yellow
}
/* app.listen(80) */