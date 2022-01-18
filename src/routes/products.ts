import express, { Router } from 'express';
import { 
    getProducts, 
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/products'
import { authorize, protect } from '../middleware/auth';
import Product from '../models/Product';
import reviewRouter from './reviews';
import abstractedResults from '../middleware/abstractedResults';

const router: Router = express.Router();

// Reroute into other resource routers
router.use('/:productId/reviews', reviewRouter);


router
  .route('/')
  .get(abstractedResults(Product, 'reviews'),getProducts)
  .post(protect, authorize('admin', 'vendor'), addProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin', 'vendor'),updateProduct)
  .delete(protect, authorize('admin', 'vendor'), deleteProduct);

export default router;