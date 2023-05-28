import express from "express";
import Controller from './controller.interface';

class TicketContoller implements Controller{
    public path = "/book/";
    public router = express.Router();

    constructor(){
        this.initializeRoutes();
    }
    private initializeRoutes(){
        
    }
}

export default TicketContoller;