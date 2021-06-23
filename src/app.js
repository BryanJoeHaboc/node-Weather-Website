const weather = require('./weatherApp.js')
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const app = express()
const port = process.env.PORT || 3000

// setup for handlebars
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsDirectoryPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')
console.log(partialsPath);
hbs.registerPartials(partialsPath);

// setup static directory to serve
app.use(express.static(publicDirectoryPath));


app.set('view engine','hbs');
app.set('views',viewsDirectoryPath);
app.get('', (req,res) =>{
    res.render('index', {
        title: 'Weather APP',
        name: 'Bryan Joe Haboc',
 
    })
});

app.get('/about', (req,res) =>{
    res.render('about', {
        title: 'ABOUT PAGE',
        name: 'Naruto Uzumaki',
    })
})

app.get('/help', (req,res) =>{
    res.render('help', {
        title: 'HELP PAGE',
        middle: 'This is the help page. ',
        name: 'Bryan Joe Haboc'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address){
        return res.send({
           error: 'Please provide an address',
        })
    }

    weather.geocode(req.query.address, (error,{longitude,latitude} = {}) =>{
        if (error) {
            return res.send({error})
        }

        weather.weatherUpdate(latitude,longitude, (error,{forecast,location = {}}) =>  {
            if (error) {
                return res.send({error})
            }
            res.send({
                forecast,
                location,
                address: req.query.address
            })
        })
    })
  })


app.get('/help/*', (req, res) => {
    res.render('error', {
        title: '404 Page',
        error: 'Help page not found',
        name: 'Bryan Joe Haboc'
    })
  })

app.get('*', (req, res) => {
    res.render('error', {
        title: '404 Page',
        error: 'Page not found',
        name: 'Bryan Joe Haboc',
    })
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})