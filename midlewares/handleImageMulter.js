const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async(req, file) => {
        // async code using `req` and `file`
        // ...
        return {
            folder: 'image',
            format: 'jpg',
            public_id: 'some_unique_id',
        };
    },
});
exports.productImages = function() {
    const fileFilter = (req, file, cb) => {

        // reject a file
        if (file.mimetype === "image/jpg" || file.mimetype === "image/png") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };

    const upload = multer({ storage: storage, fileFilter: fileFilter });

    return upload.array("productImage", 12);
};