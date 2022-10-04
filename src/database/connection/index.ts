import config from 'config';
import mongoose from 'mongoose';
import express from 'express'
const db_Url: any = config.get('db_Url');
const mongooseConnection = express()
mongoose.connect(
    db_Url
).then(() => console.log('Database successfully connected')).catch(err => console.log(err));

export { mongooseConnection }