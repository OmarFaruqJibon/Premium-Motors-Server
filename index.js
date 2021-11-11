const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --------------------------------------------------------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gqaks.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();

        const database = client.db("Permium_Motors");
        const carsCollection = database.collection("Cars");
        const ordersCollection = database.collection("Orders");
        const usersCollection = database.collection("Users");

        // get cars api
        app.get('/cars', async(req, res) => {
            const cursor =  carsCollection.find({});
            const cars = await cursor.toArray();
            res.send(cars);
        });

       // GET SINGLE car
      app.get('/carDetails/:id', async (req, res) => {
        const id = req.params.id;
        console.log('hitting single car ',id);
        const query = {_id: ObjectId(id)};
        const car = await carsCollection.findOne(query);
        res.json(car);
      });

       // GET all orders
      app.get('/orders', async (req, res) => {
        const cursor =  ordersCollection.find({});
        const orders = await cursor.toArray();
        res.send(orders);
      });



        // post cars api
        app.post('/cars', async(req, res) => {
            const cars = req.body;
            const result = await carsCollection.insertOne(cars);
            console.log(cars,result);
            res.send(result);
        });

        // post orders api
        app.post('/orders', async(req, res) => {
            const orders = req.body;
            const result = await ordersCollection.insertOne(orders);
            console.log(orders,result);
            res.send(result);
        });


         // add all user to db
         app.post('/users', async(req,res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        })

        // update user for google log in
        app.put('/users', async(req,res)=>{
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set:user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);

        });


        //DELETE order API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            console.log(query,result);
            res.json(1);
        })








    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send('Welcome to Premium-Motors server');
});
app.listen(port, ()=>{
    console.log('Running on port: ', port);
});