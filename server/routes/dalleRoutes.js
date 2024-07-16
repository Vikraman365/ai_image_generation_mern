import express, { response } from 'express';

import * as dotenv from 'dotenv';
import query from './hugg.js';


dotenv.config();


const router=express.Router(); 

router.route('/').get((req,res) => {
    res.send('Hello from dall-e');
});


router.route('/').post(async(req,res) => {
    try{
        const {prompt}=req.body;
        const response = await query({prompt});
        console.log("aaa",response)
        res.status(200).json({photo:response});
    }    catch (error) {
        console.log(error);
        res.status(500).json(error?.response.error);
    }
});

export default router;