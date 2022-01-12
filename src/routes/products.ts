import express, { Router } from 'express';
import { 
    getProducts, 
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/products'

const router: Router = express.Router();


router
  .route('/')
  .get(getProducts)
  .post(addProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

  export default router;