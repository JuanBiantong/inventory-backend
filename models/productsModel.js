const mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    productName: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
    },
    purchasePrice: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32,
    },
    sellingPrice: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32,
    },
    stock: {
        type: Number,
    },
    productImage: {
        data: Buffer,
        contentType: String,
    },
    creationDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now }
});

ProductSchema.virtual("url").get(function() {
    return "/product/" + this._id;
});

// will use mongoose-paginate plugin to retrieve data when make pagination
ProductSchema.plugin(mongoosePaginate);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;