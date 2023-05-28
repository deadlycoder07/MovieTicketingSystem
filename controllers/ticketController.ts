import express from "express";
import cinemaModel from "../models/cinema.model";
import Controller from './controller.interface';

class TicketContoller implements Controller{
    public path = "/book/";
    public router = express.Router();
    public redisClient:any;
    public cinema = cinemaModel;
    constructor(){
        this.initializeRoutes();
    }
    private initializeRoutes(){

    }
    private setRedisClient(redisClient:any){
        this.redisClient = redisClient;
    }
    private bookTicket = async(req:express.Request,res:express.Response) => { 
        const { id, seatNumber } = req.params;
        this.cinema.findById(id)
        .then(async(cinema) => {
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
    }
   
}

export default TicketContoller;