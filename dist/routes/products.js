"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_1 = require("../controllers/products");
const auth_1 = require("../middleware/auth");
const Product_1 = __importDefault(require("../models/Product"));
const reviews_1 = __importDefault(require("./reviews"));
const abstractedResults_1 = __importDefault(require("../middleware/abstractedResults"));
const router = express_1.default.Router();
// Reroute into other resource routers
router.use('/:productId/reviews', reviews_1.default);
router
    .route('/')
    .get((0, abstractedResults_1.default)(Product_1.default, 'reviews'), products_1.getProducts)
    .post(auth_1.protect, (0, auth_1.authorize)('admin', 'vendor'), products_1.addProduct);
router
    .route('/:id')
    .get(products_1.getProduct)
    .put(auth_1.protect, (0, auth_1.authorize)('admin', 'vendor'), products_1.updateProduct)
    .delete(auth_1.protect, (0, auth_1.authorize)('admin', 'vendor'), products_1.deleteProduct);
exports.default = router;
