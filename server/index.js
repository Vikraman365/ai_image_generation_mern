import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
//  .js needs to be addedd in nodejs, but not in react

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/', async(req, res) => {
    res.send('Hello from dall-e');
    });

const startServer=  async () => {
    try{
        connectDB(process.env.MONGODB_URL);
        app.listen(8080, () => {
            console.log(`Server is running on port 8080`);
        })
    } catch (error) {
        console.log(error);
    }


}

startServer();