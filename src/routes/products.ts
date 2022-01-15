import express, { Router } from 'express';
import { 
    getProducts, 
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/products'
import { protect } from '../middleware/auth';

const router: Router = express.Router();


router
  .route('/')
  .get(getProducts)
  .post(protect, addProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

export default router;