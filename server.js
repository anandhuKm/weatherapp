const express = require('express')
const config = require('./config');
const { apps: port } = config;
var app = new express()
const bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({ extended: true }))
app.set('views', './src/views')
app.set('view engine', 'ejs')

var weather = {
    city: 'City_name',
    temperature: 'Temperature',
    description: 'Description',
    icon: 'Icon'
}
var data1 = { weather: weather }

const weathershowrouter = require('./src/routes/weathershow_routes')(data1)
app.use("/show", weathershowrouter)

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port, function () {
    console.log('Listening to port')
})

