const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    totalNumberOfAlerts: {
        type: Number,
        required: true
    },
    numberOfEmployeesTriggeringAlerts: {
        type: Number,
        required: true
    },
});

const Stats = mongoose.model('Stats', statsSchema);
module.exports = Stats;
