const express = require('express');
var weathershowrouter = express.Router()
const data = require('../models/weathermodel')
const forecast = require('../models/forecastmodel')
const request = require('request')


var cityname = {}
var country = {}
var usermin = {}
var usermax = {}
var weather_received = {}
var weatherapi = {}
var dates = []
var temps = []

function router(weather) {
    weathershowrouter.route('/').get((req, res) => {
        cityname = req.param('city_name')
        country = req.param('country_name')
        usermin = req.param('mintemp')
        usermax = req.param('maxtemp')
        var url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityname},${country}&units=metric&appid=2a39502a86b5e636c2547b870d39d724`
        request(url, (error, response, body) => {

            weatherapi = JSON.parse(body)
            var da = new Date()
            var dat = da.getFullYear()
            console.log(da)
            console.log(weatherapi)

            if (weatherapi.cod == 404) {
                res.render('weather', weather)
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
                }
                var datatoshow = { weather: weather_received }
                console.log(weatherapi.list[0].dt_txt)
                res.render('weather', datatoshow)
            }

        })

    })

    weathershowrouter.route('/display').get((req, res) => {
        if (weatherapi.cod == 404) {
            console.log(weatherapi.message)
            res.render('weather', weather)
        }
        else {
            new Promise((resolve, reject) => {
                forecast.find({ 'cityname': weatherapi.city.name })
                    .exec((err, doc) => {
                        if (err) reject(err)
                        if (doc) {
                            for (var i = dates.length; i > 0; i--) {

                                dates.pop()
                                temps.pop()

                            }
                            console.log(doc)
                            for (let i = 0; i < 5; i++) {
                                min = doc[i].minimum
                                max = doc[i].maximum
                                if (min < usermin && max > usermax) {
                                    var str = doc[i].date
                                    var dat = str.slice(0, 11);
                                    dates.push(dat)
                                    temps.push(doc[i].temperature)
                                }
                                else if (min < usermin) {
                                    var str = doc[i].date
                                    var dat = str.slice(0, 11);
                                    dates.push(dat)
                                    temps.push(doc[i].temperature)
                                }
                                else if (max > usermax) {
                                    var str = doc[i].date
                                    var dat = str.slice(0, 11);
                                    dates.push(dat)
                                    temps.push(doc[i].temperature)
                                }
                            }
                            console.log(dates)
                            var lat = weatherapi.city.coord.lat
                            var lon = weatherapi.city.coord.lon
                            console.log(temps)
                            res.render('weatherdisplay', { weather_received, lat, lon, dates, temps,usermin,usermax })

                        }
                        else {
                            res.render('weather',weather)
                        }
                    })
            })
        }
    })


    weathershowrouter.route('/add').get((req, res) => {

        if (weatherapi.cod == 404) {
            console.log(weatherapi.message)
            res.render('weather', weather)
        }
        else {
            new Promise((resolve, reject) => {
                data.findOne({ city: weatherapi.city.name })
                    .exec((err, doc) => {

                        if (err) reject(err)
                        if (doc) {
                            if (doc.date == weatherapi.list[0].dt_txt &&  doc.temperature == weatherapi.list[0].main.temp) {

                                console.log(doc)
                                console.log('city already in db')
                                var dbdata = { weather: doc }
                                res.render('weathersaved', dbdata)

                            }
                            else if (doc.date != weatherapi.list[0].dt_txt || doc.temperature != weatherapi.list[0].main.temp) {

                                console.log(doc.date)
                                forecast.deleteMany({ 'cityname': weatherapi.city.name }, ((err, result) => {
                                    if (err) throw err
                                    else console.log(result)
                                }))

                                for (let i = 0; i < weatherapi.list.length; i += 8) {
                                    var forecast_recieved = {
                                        date: weatherapi.list[i].dt_txt,
                                        cityname: weatherapi.city.name,
                                        temperature: weatherapi.list[i].main.temp,
                                        minimum: weatherapi.list[i].main.temp_min,
                                        maximum: weatherapi.list[i].main.temp_max
                                    }
                                    var forecast_tosave = new forecast(forecast_recieved)
                                    forecast_tosave.save()

                                }
                                data.deleteOne({ 'city': weatherapi.city.name }, ((err, result) => {
                                    if (err) throw err
                                    else console.log(result)
                                }))
                                var weatherdata_tosave = new data(weather_received);
                                weatherdata_tosave.save();

                                var ddata = { weather: weather_received }
                                res.render('weathersaved', ddata)


                            }
                        }
                        else {

                            for (let i = 0; i < weatherapi.list.length; i += 8) {
                                var forecast_recieved = {
                                    date: weatherapi.list[i].dt_txt,
                                    cityname: weatherapi.city.name,
                                    temperature: weatherapi.list[i].main.temp,
                                    minimum: weatherapi.list[i].main.temp_min,
                                    maximum: weatherapi.list[i].main.temp_max
                                }
                                var forecast_tosave = new forecast(forecast_recieved)
                                forecast_tosave.save()

                            }
                            var weatherdata_tosave = new data(weather_received);
                            weatherdata_tosave.save();
                            var datatoshow = { weather: weatherdata_tosave }
                            res.render('weathersaved', datatoshow)

                        }
                    })
            })
        }
    })
    return weathershowrouter
}
module.exports = router
