"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const cinemaController_1 = __importDefault(require("./controllers/cinemaController"));
const ticketController_1 = __importDefault(require("./controllers/ticketController"));
const app = new app_1.default([
    new cinemaController_1.default(),
    new ticketController_1.default()
], 3000);
app.listen();
