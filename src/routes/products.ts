import express, { Router } from 'express';
import { 
    getProducts, 
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/products'
import { protect } from '../middleware/auth';
import Product from '../models/Product';
import reviewRouter from './reviews';
import abstractedResults from '../middleware/abstractedResults';

const router: Router = express.Router();

// Reroute into other resource routers
router.use('/:productId/reviews', reviewRouter);


router
  .route('/')
  .get(abstractedResults(Product, 'reviews'),getProducts)
  .post(protect, addProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

export default router;