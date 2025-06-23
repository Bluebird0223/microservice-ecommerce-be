const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter category name"],
        trim: true,
        set: value => value.toLowerCase()
    },
    description: {
        type: String,
        required: [true, "Please enter category description"],
        trim: true
    },
}, {
    timestamps: true,
    strict: false
}
);

module.exports = mongoose.model('Category', categorySchema);