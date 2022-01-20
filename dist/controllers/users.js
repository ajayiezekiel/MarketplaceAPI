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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const async_1 = __importDefault(require("../middleware/async"));
const User_1 = __importDefault(require("../models/User"));
;
;
;
// @desc    Get all users
// @route   GET api/v1/users
// @access  Private/Admin
const getUsers = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(res.abstractedResults);
}));
exports.getUsers = getUsers;
// @desc    Get single user
// @route   GET api/v1/users/:id
// @access  Private/Admin
const getUser = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.params.id);
    res.status(200).json({
        success: true,
        data: user
    });
}));
exports.getUser = getUser;
// @desc    Create user
// @route   POST api/v1/users
// @access  Private/Admin
const createUser = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.create(req.body);
    res.status(201).json({
        success: true,
        data: user
    });
}));
exports.createUser = createUser;
// @desc    Update user
// @route   PUT api/v1/users/:id
// @access  Private/Admin
const updateUser = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: user
    });
}));
exports.updateUser = updateUser;
// @desc    Delete user
// @route   DELETE api/v1/users/:id
// @access  Private/Admin
const deleteUser = (0, async_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield User_1.default.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: {}
    });
}));
exports.deleteUser = deleteUser;
