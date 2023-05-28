import express from "express";
import bodyParser from "body-parser";
import Controller  from "./controllers/controller.interface";
import errorMiddleware from "./middlewares/error.middleware";
import mongoose  from "mongoose";
import 'dotenv/config';
class App{
    public path:string = "/api/v1"
    public app = express();
    public port:number;

    constructor(controllers:Controller[],port:number){
        this.port = port;
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.connectToTheDatabase();
    }
    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(errorMiddleware)
      }
    private initializeControllers(controllers:Controller[]){
        controllers.forEach((controller:any)=>{
            this.app.use(this.path,controller.router);
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