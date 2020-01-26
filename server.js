const express = require('express')
const config = require('./config');
var request = require('request');
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

var weather_received = {}
var weatherapi = {}
var cityname = "Stockholm"
var country = "Swe"
var datatoshow = {}


    url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityname},${country}&units=metric&appid=2a39502a86b5e636c2547b870d39d724`
    request(url, (error, response, body) => {
        weatherapi = JSON.parse(body);
        var da = new Date();
        var dat = da.getFullYear();
        // console.log(da);
        // console.log(weatherapi);
        if (weatherapi.cod == 404) {
            //res.render('index', weather)
        }
        else {
            weather_received = {
                city: weatherapi.city.name,
                country: weatherapi.city.country,
                temperature: weatherapi.list[0].main.temp,
                minimum: weatherapi.list[0].main.temp_min,
                maximum: weatherapi.list[0].main.temp_max,
                description: weatherapi.list[0].weather[0].description,
                icon: weatherapi.list[0].weather[0].icon,
                date: weatherapi.list[0].dt_txt
            };
            datatoshow = { weather: weather_received };
            //console.log(weatherapi.list[0].dt_txt);
            //res.render('index', datatoshow)
        }
    })


var data1 = { weather: weather }

const weathershowrouter = require('./src/routes/weathershow_routes')(data1)
app.use("/show", weathershowrouter)

app.get('/', (req, res) => {
    res.render('index',datatoshow)
})

app.get('/test', (req, res) => {
    res.send(weatherapi.city.name)
})

app.listen(port, function () {
    console.log('Listening to port')
})

