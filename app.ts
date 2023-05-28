import express from "express";
import bodyParser from "body-parser";
import Controller  from "./controllers/controller.interface";
import errorMiddleware from "./middlewares/error.middleware";
import mongoose  from "mongoose";
import {RedisClientType,createClient} from 'redis';
import 'dotenv/config';
import RedisClient from "@redis/client/dist/lib/client";
class App{
    public path:string = "/api/v1"
    public app = express();
    public port:number;
    public redisClient:any;
    constructor(controllers:Controller[],port:number){
        this.port = port;
        this.connectToRedis();
        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }
    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(errorMiddleware)
      }
    private initializeControllers(controllers:Controller[]){
        controllers.forEach((controller:any)=>{
            controller.setRedisClient(this.redisClient)
            this.app.use(this.path,controller.router);
        });
    }
    private connectToRedis(){
        const cacheOptions = {
            url: process.env.redisURL,
        };
        this.redisClient = createClient({
            ...cacheOptions
        });
    }
    private connectToTheDatabase() {
        const {
          MONGO_USER,
          MONGO_PASSWORD,
          MONGO_PATH,
        } = process.env;
        console.log(MONGO_PATH);
        mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
      }
    public listen() {
        this.app.listen(this.port, () => {
          console.log(`App listening on the port ${this.port}`);
        });
    }
}

export default App;