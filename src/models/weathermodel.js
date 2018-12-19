const mongoose = require('mongoose')
const config = require('../../config');
const { db: { host, port, name } } = config;
const connectionString = `mongodb://${host}:${port}/${name}`;
mongoose.connect(connectionString)
const schema = mongoose.Schema
var weatherschema = new schema
    ({
        city: String,
        country: String,
        temperature: String,
        minimum: String,
        maximum: String,
        description: String,
        icon: String,
        date: String

    })

var weathermodel = mongoose.model('weatherdata', weatherschema)
module.exports = weathermodel