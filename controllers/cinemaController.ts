import express from "express";
import Controller from './controller.interface';

class CinemaController implements Controller{
    public path = "/book/";
    public router = express.Router();

    constructor(){
        this.initializeRoutes();
    }
    private initializeRoutes(){
        
    }
}

export default CinemaController;