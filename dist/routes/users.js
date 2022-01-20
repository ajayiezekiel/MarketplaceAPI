"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)({ mergeParams: true });
const User_1 = __importDefault(require("../models/User"));
const abstractedResults_1 = __importDefault(require("../middleware/abstractedResults"));
const auth_1 = require("../middleware/auth");
const users_1 = require("../controllers/users");
router.use(auth_1.protect);
router.use((0, auth_1.authorize)('admin'));
router
    .route('/')
    .get((0, abstractedResults_1.default)(User_1.default), users_1.getUsers)
    .post(users_1.createUser);
router
    .route('/:id')
    .get(users_1.getUser)
    .put(users_1.updateUser)
    .delete(users_1.deleteUser);
exports.default = router;
