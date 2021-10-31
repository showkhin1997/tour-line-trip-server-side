const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleweare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6re1r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("tour_line_trip");
        const servicesCollection = database.collection("services");
        const ordersCollection = database.collection("orders");
        const confirmOrdersCollection = database.collection("confirmOrder");

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET SINGLE SERVICE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        });

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service)
            res.json(result);
        });

        // POST Orders Collection
        app.post('/orders', async (req, res) => {
            const orders = await ordersCollection.insertOne(req.body);
            res.json(orders);
        });

        // GET Orders Collection
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // POST Order collection with user
        app.post('/confirmOrder', async (req, res) => {
            const order = req.body;
            const confrirmOrder = await confirmOrdersCollection.insertOne(order);
            res.json(confrirmOrder);
        });

        // GET Order collection with user
        app.get('/confirmOrder', async (req, res) => {
            const cursor = confirmOrdersCollection.find({});
            const confirmOrders = await cursor.toArray();
            res.send(confirmOrders);
        });

        // UPDATE API
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updatedService = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedService.name,
                    country: updatedService.country,
                    description: updatedService.description,
                    img: updatedService.img,
                    price: updatedService.price,
                    day: updatedService.day,
                    address: updatedService.address,
                },
            };
            const result = await servicesCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // DELETE API services from dashboard
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        });

        // DELETE API users from dashboard
        app.delete('/confirmOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await confirmOrdersCollection.deleteOne(query);
            res.json(result);
        });

        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Torism Server Running');
});

app.listen(port, (req, res) => {
    console.log('listening Port', port);
});