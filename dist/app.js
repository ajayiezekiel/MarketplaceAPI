"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const hpp_1 = __importDefault(require("hpp"));
// Route files
const products_1 = __importDefault(require("./routes/products"));
const auth_1 = __importDefault(require("./routes/auth"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const users_1 = __importDefault(require("./routes/users"));
// Import db connection file
const db_1 = __importDefault(require("./config/db"));
// Import error handler
const error_1 = __importDefault(require("./middleware/error"));
const app = (0, express_1.default)();
// Load env vars
dotenv_1.default.config({
    path: './src/config/config.env'
});
// Connect to Database
(0, db_1.default)();
// Body parser
app.use(express_1.default.json());
// Sanitize data
app.use((0, express_mongo_sanitize_1.default)());
// Set security headers
app.use((0, helmet_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: 100
});
app.use(limiter);
// Prevent http param pollution
app.use((0, hpp_1.default)());
// Enable cors
app.use((0, cors_1.default)());
// Set static folder
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Mount routers
app.use('/api/v1/products', products_1.default);
app.use('/api/v1/auth', auth_1.default);
app.use('/api/v1/reviews', reviews_1.default);
app.use('/api/v1/users', users_1.default);
const PORT = process.env.PORT || 5000;
app.use(error_1.default);
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});
