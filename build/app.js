"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
class App {
    constructor(controllers, port) {
        this.path = "/api/v1";
        this.app = (0, express_1.default)();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.connectToTheDatabase();
    }
    initializeMiddlewares() {
        this.app.use(body_parser_1.default.json());
        this.app.use(error_middleware_1.default);
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use(this.path, controller.router);
        });
    }
    connectToTheDatabase() {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, } = process.env;
        console.log(MONGO_PATH);
        mongoose_1.default.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}
exports.default = App;
