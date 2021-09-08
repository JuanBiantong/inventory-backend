const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productContoller");
const { auth } = require("../../midlewares/auth");

router.get("/", productController.allProducts);
router.post(
    "/create",
    auth,
    productController.createProduct
);
router.patch(
    "/update/:productId",
    auth,
    productController.updateProduct
);
router.get("/:productId", productController.getProductById);
router.delete("/:productId", productController.deleteProduct);

module.exports = router;