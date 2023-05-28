import * as mongoose from 'mongoose';
import Cinema from '../interfaces/cinema.interface';

const cinemaSchema = new mongoose.Schema({
    seats:[Boolean]
})

const cinemaModel = mongoose.model<Cinema & mongoose.Document>('Cinema',cinemaSchema);
export default cinemaModel;