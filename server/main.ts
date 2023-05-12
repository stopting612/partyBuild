import express from 'express';
import cors from "cors"
import Knex from 'knex';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv'
import aws from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
dotenv.config()

const knexConfig = require('./knexfile');
const knex = Knex(knexConfig[process.env.NODE_ENV || "development"])

const app = express();


app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (request, response) => {
    const payload = request.body;

    console.log("Got payload: " + payload);

    response.status(200);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
    origin: [/localhost:\d{1,}/, process.env.CORS_HOST ?? '']
}))

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-southeast-1'
});

export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'partybuildhkphoto',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`);
        }
    })
})

import { PartyRoomService } from "./service/PartyRoomService"
import { PartyRoomController } from "./controller/PartyRoomController"
export const partyRoomService = new PartyRoomService(knex);
export const partyRoomController = new PartyRoomController(partyRoomService);

import { AlcoholService } from "./service/AlcoholService"
import { AlcoholController } from "./controller/AlcoholController"
export const alcoholService = new AlcoholService(knex);
export const alcoholController = new AlcoholController(alcoholService);

import { RestaurantService } from "./service/RestaurantService"
import { RestaurantController } from "./controller/RestaurantController"
export const restaurantService = new RestaurantService(knex);
export const restaurantController = new RestaurantController(restaurantService);

import { UserService } from "./service/UserService"
import { UserController } from "./controller/UserController"
export const userService = new UserService(knex);
export const userController = new UserController(userService);

import { NewPartyRoomService } from "./service/NewPartyRoomService"
import { NewPartyRoomController } from "./controller/NewPartyRoomController"
const newPartyRoomService = new NewPartyRoomService(knex);
export const newPartyRoomController = new NewPartyRoomController(newPartyRoomService);

import { CopartnerService } from "./service/CopartnerService"
import { CopartnerController } from "./controller/CopartnerController"
export const copartnerService = new CopartnerService(knex);
export const copartnerController = new CopartnerController(copartnerService);

import { AdminService } from "./service/AdminService"
import { AdminController } from "./controller/AdminController"
export const adminService = new AdminService(knex);
export const adminController = new AdminController(adminService);

import { router } from "./router"
app.use('/api/v1', router)

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/`);
});