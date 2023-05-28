import express from 'express';
import bodyParser from 'body-parser';
import App from './app';
import CinemaController from './controllers/cinemaController';
import TicketContoller from './controllers/ticketController';
const app = new App(
    [
        new CinemaController(),
        new TicketContoller()
    ],
    3000
);

app.listen();
