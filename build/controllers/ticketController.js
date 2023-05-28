"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cinema_model_1 = __importDefault(require("../models/cinema.model"));
class TicketContoller {
    constructor() {
        this.path = "/book/";
        this.router = express_1.default.Router();
        this.cinema = cinema_model_1.default;
        this.bookTicket = async (req, res) => {
            const { id, seatNumber } = req.params;
            this.cinema.findById(id)
                .then(async (cinema) => {
                if (!cinema) {
                    res.status(404).json({ error: 'Cinema not found' });
                    return;
                }
                const seatIndex = Number(seatNumber) - 1;
                // Lock the curr Seat
                const Key = `lock:${id}:${seatNumber}`;
                const isLocked = await this.redisClient.set(Key, 'locked', 'NX', 'EX', 10);
                if (!isLocked) {
                    res.status(400).json({ error: 'Seat already being purchased' });
                    return;
                }
                if (cinema.seats[seatIndex]) {
                    await this.redisClient.del(Key);
                    res.status(400).json({ error: 'Seat already purchased' });
                    return;
                }
                cinema.seats[seatIndex] = true;
                // release the curr Seat
                await this.redisClient.del(Key);
                res.json({ seat: seatNumber });
            });
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
    }
    setRedisClient(redisClient) {
        this.redisClient = redisClient;
    }
}
exports.default = TicketContoller;
