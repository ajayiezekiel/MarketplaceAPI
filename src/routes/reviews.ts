import express, { Router } from 'express';
import {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview
} from '../controllers/reviews'
import Review from '../models/Review';
import abstractedResults from '../middleware/abstractedResults';
import { protect } from '../middleware/auth';

const router: Router = Router({ mergeParams: true });

router
  .route('/')
  .get(abstractedResults(Review, {
      path: 'product',
      select: 'name description'
  }), getReviews)
  .post(protect, addReview)

router
  .route('/:id')
  .get(getReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview)

export default router