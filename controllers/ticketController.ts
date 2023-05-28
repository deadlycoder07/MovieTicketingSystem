import express from "express";
import cinemaModel from "../models/cinema.model";
import Controller from './controller.interface';

class TicketContoller implements Controller{
    public path = "/book";
    public router = express.Router();
    public redisClient:any;
    public cinema = cinemaModel;
    constructor(){
        this.initializeRoutes();
    }
    private initializeRoutes(){
        this.router.post(`${this.path}/:id/seat/:seatNumer`,this.bookTicket);
        this.router.post(`${this.path}/cinema/:id`,this.bookMultipeTicket);
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
    private bookMultipeTicket =async (req:express.Request,res:express.Response) => {
        const { id } = req.params;
        this.cinema.findById(id)
        .then(async(cinema)=>{
            if (!cinema) {
                res.status(404).json({ error: 'Cinema not found' });
                return;
            }
    
            // Acquire a lock for the cinema
            const Key = `lock:${id}`;
            const isLocked = await this.redisClient.set(Key, 'locked', 'NX', 'EX', 10);
            if (!isLocked) {
                res.status(400).json({ error: 'Cinema already being processed' });
                return;
            }
    
            const consecutiveSeats: number[] = [];
            for (let i = 0; i < cinema.seats.length; i++) {
                if (!cinema.seats[i] && !cinema.seats[i + 1]) {
                consecutiveSeats.push(i + 1, i + 2);
                cinema.seats[i] = true;
                cinema.seats[i + 1] = true;
                break;
                }
            }
    
            if (consecutiveSeats.length === 2) {
                await this.redisClient.del(Key); // Release the key
                res.json({ seats: consecutiveSeats });
            } else {
                await this.redisClient.del(Key); // Release the Key
                res.status(400).json({ error: 'No consecutive seats available' });
            }
        });
        
    }
}

export default TicketContoller;