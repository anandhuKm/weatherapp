const express = require('express');
var routerweather = express.Router();
const request = require('request')
const data = require('../models/weathermodel')
function router(weather) {
    routerweather.route('/').get((req, res) => {
        var cityname = req.param('city_name')
        var country = req.param('country_name')
        var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityname},${country}&units=metric&appid=2a39502a86b5e636c2547b870d39d724`
        request(url, (error, response, body) => {

            var weatherapi = JSON.parse(body)
            if (weatherapi.cod == 404) {
                console.log(weatherapi.message)
                res.render('weather', weather)
            }
            else {
                data.findOne({ date: weatherapi.id }).then(function (b) {

                    console.log(weatherapi)
                    if (b != null || b == weatherapi.id) {

                        console.log('weather already in db')
                        var dbdata = { weather: b }
                        console.log(dbdata)
                        res.render('weather', dbdata)
                    }
                    else {
                            var weather_received_api = {
                            city: weatherapi.name,
                            country: weatherapi.sys.country,
                            temperature: weatherapi.main.temp,
                            minimum: weatherapi.main.temp_min,
                            maximum: weatherapi.main.temp_max,
                            description: weatherapi.weather[0].description,
                            icon: weatherapi.weather[0].icon,
                            date: weatherapi.id
                        }
                        var weatherdata_tosave = new data(weather_received_api);
                        console.log(weatherdata_tosave)
                        weatherdata_tosave.save();
                        var datatoshow = { weather: weather_received_api }
                        res.render('weather', datatoshow)

                    }

                })

            }
        });

    })

    return routerweather;
}
module.exports = router
