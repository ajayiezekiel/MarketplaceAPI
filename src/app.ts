import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import colors from 'colors';

// Route files
import productRoute from './routes/products';
import authRoute from './routes/auth';

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

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/products', productRoute);
app.use('/api/v1/auth', authRoute);

const PORT = process.env.PORT || 5000;

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
}); 