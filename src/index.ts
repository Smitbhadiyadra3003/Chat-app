"use strict"

import * as bodyParser from 'body-parser';
import express, { Request, Response } from 'express';  
import http from 'http';
import cors from 'cors'
import { mongooseConnection} from './database'
import * as packageInfo from '../package.json'
// import config from 'config'
import { router } from './Routes'
import path from 'path';
import { ioevents, socketServer } from './helper/socket';



 
const app = express();
var allow_list = ['https://www.unicornui.com']
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (allow_list.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}


app.use(cors())
app.use(mongooseConnection)
app.use(bodyParser.json({ limit: '200mb' }))
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }))
// console.log(process.env.NODE_ENV);
const health = (req, res) => {
    return res.status(200).json({
        message: `grubgrams Server is Running, Server health is green`,
        app: packageInfo.name,
        version: packageInfo.version,
        description: packageInfo.description,   
        author: packageInfo.author,
        license: packageInfo.license
    })
}
const PublicDirectoryPath= path.join(__dirname,'../public');
console.log(PublicDirectoryPath);

app.use(express.static(PublicDirectoryPath));
const bad_gateway = (req, res) => { return res.status(502).json({ status: 502, message: "grubgrams Backend API Bad Gateway" }) }
app.get('/', () => {});
app.get('/health', health);
app.get('/isServerUp', (req, res) => {
    res.send('Server is running ');
});
app.use(router)
app.use('*', bad_gateway);

export default socketServer(app);
