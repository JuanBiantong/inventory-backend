const Product = require("../models/productsModel");
const formidable = require("formidable");
const fs = require("fs");
const Joi = require('joi');
const _ = require("lodash");


//get all products
exports.allProducts = async(req, res) => {
    let page = req.query.page || 1;
    let perPage = parseInt(req.query.perPage) || 8;
    try {
        await Product.paginate({ numberInStock: { $ne: 0 } }, { sort: { creationDate: -1 }, page: page, limit: perPage },
            (err, result) => {
                if (err) {
                    res.status(400).json({ error: "Couldn't find products" });
                } else {
                    res.status(200).json({ products: result.docs, pagesCount: result.pages });
                }
            }
        );
    } catch (error) {
        return res.status(400).json({
            error: error
        })
    }
};

exports.deleteProduct = async(req, res) => {
    const id = req.params.productId;
    try {
        await Product.findByIdAndDelete(id);

        res.send({ message: 'Product deleted succesfully' });
    } catch (error) {
        return res.status(400).json({
            error: error
        })
    }
};

//create new products
exports.createProduct = (req, res) => {

    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async(err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        //validation
        try {

            const { productName, purchasePrice, sellingPrice, stock } = fields
            const queryProductName = await Product.findOne({ productName: fields.productName });
            if (queryProductName) {
                return res.status(400).json({
                    error: "Product name is taken"
                })
            }

            const schema = Joi.object({
                productName: Joi.string().required(),
                purchasePrice: Joi.number().required(),
                sellingPrice: Joi.number().required(),
                stock: Joi.number().required(),
            }).unknown(true);


            await schema.validateAsync(fields)

            if (!productName || !purchasePrice || !sellingPrice || !stock) {
                return res.status(400).json({
                    error: "All fields are required"
                })
            }

            let product = new Product(fields)
            if (files.productImage) {
                if (files.productImage.size >= 100000) {
                    return res.status(400).json({
                        error: "Image should be less than 100kb in size"
                    })
                }
                product.productImage.data = fs.readFileSync(files.productImage.path)
                product.productImage.contentType = files.productImage.type

                let allowType = ['image/jpg', 'image/jpeg', 'image/png'];
                let check = allowType.includes(product.productImage.contentType);
                if (!check) {
                    return res.status(400).json({
                        error: "Image type should be png or jpg/jpeg"
                    })
                }

            } else {
                return res.status(400).json({
                    error: "Please upload product image"
                })
            }

            product.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                res.json("Product created successfully");
            })
        } catch (error) {
            return res.status(400).json({
                error: error
            })
        }
    })
};


//get product by ID
exports.getProductById = async(req, res) => {
    const id = req.params.productId;
    try {
        const result = await Product.findById(id);
        res.json(result);
    } catch (error) {
        return res.status(400).json({
            error: error
        })
    }
};

//delete products
exports.deleteProduct = async(req, res) => {
    const id = req.params.productId;
    try {
        await Product.findByIdAndDelete(id);

        res.send({ message: 'Product deleted succesfully' });
    } catch (error) {
        return res.status(400).json({
            error: error
        })
    }
};

exports.updateProduct = (req, res) => {
    const id = req.params.productId;
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, async(err, fields, files) => {

        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            })
        }

        //validation
        try {

            const { productName, purchasePrice, sellingPrice, stock } = fields

            const schema = Joi.object({
                productName: Joi.string().required(),
                purchasePrice: Joi.number().required(),
                sellingPrice: Joi.number().required(),
                stock: Joi.number().required(),
            }).unknown(true);


            await schema.validateAsync(fields)

            if (!productName || !purchasePrice || !sellingPrice || !stock) {
                return res.status(400).json({
                    error: "All fields are required"
                })
            }

            let product = new Product(fields);

            if (files.productImage) {
                if (files.productImage.size >= 100000) {
                    return res.status(400).json({
                        error: "Image should be less than 100kb in size"
                    })
                }
                product.productImage.data = fs.readFileSync(files.productImage.path)
                product.productImage.contentType = files.productImage.type

                let allowType = ['image/jpg', 'image/jpeg', 'image/png'];
                let check = allowType.includes(product.productImage.contentType);
                if (!check) {
                    return res.status(400).json({
                        error: "Image type should be png or jpg/jpeg"
                    })
                }
            } else {
                return res.status(400).json({
                    error: "Please upload product image"
                })
            }

            const result = await Product.findByIdAndUpdate({ _id: id }, {
                purchasePrice: product.purchasePrice,
                sellingPrice: product.sellingPrice,
                stock: product.stock,
                updateDate: Date.now()
            });
            res.json("Product updated successfully");
        } catch (error) {
            return res.status(400).json({
                error: error
            })
        }
    })
};