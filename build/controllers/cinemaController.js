"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cinema_model_1 = __importDefault(require("../models/cinema.model"));
class CinemaController {
    constructor() {
        this.path = "/cinema";
        this.router = express_1.default.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(this.path, this.createCinema);
    }
    setRedisClient(redisClient) {
        this.redisClient = redisClient;
    }
    createCinema(request, response) {
        const cinemaRequestDTO = request.body;
        let cinema = { seats: Array(cinemaRequestDTO.seat).fill(false) };
        const newCinema = new cinema_model_1.default(cinema);
        newCinema.save()
            .then(savedCinema => {
            response.send({ id: savedCinema.id });
        });
    }
}
exports.default = CinemaController;
