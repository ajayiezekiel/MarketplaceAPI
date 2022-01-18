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
import { authorize, protect } from '../middleware/auth';

const router: Router = Router({ mergeParams: true });

router
  .route('/')
  .get(abstractedResults(Review, {
      path: 'product',
      select: 'name description'
  }), getReviews)
  .post(protect, authorize('user', 'admin'), addReview)

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin') ,deleteReview)

export default router