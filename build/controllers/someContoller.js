"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class SomeController {
    constructor() {
        this.path = "/hello";
        this.router = express_1.default.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.returnHello);
    }
    returnHello(req, res) {
        res.send({ "msg": "hello" });
    }
}
exports.default = SomeController;
