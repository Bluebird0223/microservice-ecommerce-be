const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"]
    },
    cuttedPrice: {
        type: Number,
        required: [true, "Please enter cutted price"]
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: true
    },
    // images: [
    //     {
    //         public_id: {
    //             type: String,
    //             required: true
    //         },
    //         url: {
    //             type: String,
    //             required: true
    //         }
    //     }
    // ],
    // stock: {
    //     type: Number,
    //     required: [true, "Please enter product stock"],
    //     maxlength: [4, "Stock cannot exceed limit"],
    //     default: 1
    // },
    // warranty: {
    //     type: Number,
    //     default: 1
    // },

    // user: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "User",
    //     required: true
    // },

}, {
    timestamps: false, // Adds createdAt and updatedAt automatically
    strict: false
});

module.exports = mongoose.model('Product', productSchema);