const mongoose = require('mongoose')
const config = require('../../config');
const { db: { host, port, name } } = config;
const connectionString = `mongodb://${host}:${port}/${name}`;
mongoose.connect(connectionString)
const schema = mongoose.Schema
var forecastschema = new schema
    ({
        date : String,
        cityname : String,
        temperature : String,
        minimum : String,
        maximum : String,
        
    })

var forecastmodel = mongoose.model('forecastdata', forecastschema)
module.exports = forecastmodel