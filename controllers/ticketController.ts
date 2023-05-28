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
            this.cinema.updateOne(cinema.id,cinema);
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
            let Seat1Key,Seat2Key,isLocked1,isLocked2;
    
    
            const consecutiveSeats: number[] = [];
            for (let i = 0; i < cinema.seats.length; i++) {
                Seat1Key = `lock:${id}:${i+1}`;
                Seat2Key = `lock:${id}:${i+2}`;
                isLocked1 = await this.redisClient.set(Seat1Key, 'locked', 'NX', 'EX', 10);
                isLocked2 = await this.redisClient.set(Seat2Key, 'locked', 'NX', 'EX', 10);
                if (!cinema.seats[i] && !cinema.seats[i + 1] && isLocked1 && isLocked2) {
                consecutiveSeats.push(i + 1, i + 2);
                cinema.seats[i] = true;
                cinema.seats[i + 1] = true;
                break;
                }else{
                  await this.redisClient.del(isLocked1);
                  await this.redisClient.del(isLocked2);
                }
            }
    
            if (consecutiveSeats.length === 2) {
                await this.redisClient.del(isLocked1);
                await this.redisClient.del(isLocked2); // Release the keys
                this.cinema.updateOne(cinema.id,cinema);
                res.json({ seats: consecutiveSeats });
            } else {
                res.status(400).json({ error: 'No consecutive seats available' });
            }
        });
        
    }
}

export default TicketContoller;