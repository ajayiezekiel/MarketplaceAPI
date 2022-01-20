"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.updateDetails = exports.getMe = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const errorResponse_1 = __importDefault(require("../utils/errorResponse"));
const async_1 = __importDefault(require("../middleware/async"));
;
// @desc    Register user
// @route   GET /api/v1/auth/register
// @access  Public
const register = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, phoneNumber } = req.body;
    // Create user
    const user = yield User_1.default.create({
        name,
        email,
        password,
        role,
        phoneNumber
    });
    sendTokenResponse(user, 201, res);
}));
exports.register = register;
// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Check if email and password is provided
    if (!email || !password) {
        return next(new errorResponse_1.default('Please provide an email or password', 400));
    }
    // Check for user
    const user = yield User_1.default.findOne({ email }).select('+password');
    if (!user) {
        return next(new errorResponse_1.default('Invalid credentials', 401));
    }
    // Check if password matches
    const isMatch = yield user.matchPassword(password);
    if (!isMatch) {
        return next(new errorResponse_1.default('Invalid credentials', 401));
    }
    sendTokenResponse(user, 200, res);
}));
exports.login = login;
// @desc    Get Logged in user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
}));
exports.getMe = getMe;
// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
const updateDetails = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Restricted the fields that can be updated
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    };
    const user = yield User_1.default.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: user
    });
}));
exports.updateDetails = updateDetails;
// @desc    Update user password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
const updatePassword = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield User_1.default.findById(req.user.id).select('+password');
    // Check current password
    if (!(yield user.matchPassword(req.body.currentPassword))) {
        return next(new errorResponse_1.default('Password is incorrect', 401));
    }
    user.password = req.body.newPassword;
    yield user.save();
    sendTokenResponse(user, 200, res);
}));
exports.updatePassword = updatePassword;
// Get token from model and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    res.status(statusCode).json({
        success: true,
        token
    });
};
