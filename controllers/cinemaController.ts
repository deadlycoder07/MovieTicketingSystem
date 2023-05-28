import express from "express";
import Controller from './controller.interface';
import CinemaRequestDTO from "../dto/cinema.interface";
import cinemaModel from "../models/cinema.model";
import Cinema from "../interfaces/cinema.interface";
class CinemaController implements Controller{
    public path = "/cinema";
    public router = express.Router();
    public redisClient:any;
    constructor(){
        this.initializeRoutes();
    }
    private initializeRoutes(){
        this.router.post(this.path,this.createCinema);
    }
    private setRedisClient(redisClient:any){
        this.redisClient = redisClient;
    }
    private createCinema(request:express.Request,response:express.Response){
        const cinemaRequestDTO:CinemaRequestDTO = request.body;
        let cinema:Cinema= {seats:Array(cinemaRequestDTO.seat).fill(false)};
        const newCinema = new cinemaModel(cinema);
        newCinema.save()
            .then(savedCinema =>{
                response.send({id:savedCinema.id});
            })
    }
}

export default CinemaController;