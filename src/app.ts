import path from 'path';
import express, { Application } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import hpp from 'hpp';
import colors from 'colors';


// Route files
import productRoute from './routes/products';
import authRoute from './routes/auth';
import reviewRoute from './routes/reviews';
import userRoute from './routes/users';


// Import db connection file
import connectDB from './config/db';

// Import error handler
import errorHandler from './middleware/error';


const app: Application = express();

// Load env vars
dotenv.config({
    path: './src/config/config.env'
});

// Connect to Database
connectDB();

// Body parser
app.use(express.json());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());


// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable cors
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/products', productRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/users', userRoute);


const PORT = process.env.PORT || 5000;

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
}); 
