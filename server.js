const express = require('express')
const app = express()

let bordersActive = 0

app.set('view engine', 'ejs')

app.use('/media', express.static(__dirname + '/media'));
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.render('index', {borderOn: bordersActive})
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

app.listen(process.env.PORT || 5000)