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
import abstractedResults from '../middleware/abstractedResults';

const router: Router = express.Router();


router
  .route('/')
  .get(abstractedResults(Product),getProducts)
  .post(protect, addProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

export default router;