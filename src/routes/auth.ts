import express, { Router } from 'express';
import { 
    register,
    login,
    getMe,
    updateDetails,
    updatePassword
} from '../controllers/auth';
import { protect } from '../middleware/auth';
 
const router: Router = express.Router();

router.post('/register', register)

router.post('/login', login)

router.get('/me', protect, getMe);

router.put('/updatedetails', protect, updateDetails);

router.put('/updatepassword', protect, updatePassword);

export default router;