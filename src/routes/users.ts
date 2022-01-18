import express, { Router } from 'express';
const router: Router = Router({ mergeParams: true });
import User from '../models/User';
import abstractedResults from '../middleware/abstractedResults';
import { authorize, protect } from '../middleware/auth';

import { 
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
 } from '../controllers/users';



router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(abstractedResults(User), getUsers)
  .post(createUser)

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

  
export default router;