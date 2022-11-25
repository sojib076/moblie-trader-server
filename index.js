const express = require('express');
const app = express();
const port = 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
jwt = require('jsonwebtoken');
// require stripe
const stripe = require('stripe')('sk_test_51M6C3VDgKvWy1pBDGOeGI1buEk3WTmBlOAQUs1Cnjn5MMwR5IixBLwhnXLPi9XoTNInxkIsAN4WBgTRQr2o35LNT00cpzsXDEk');
/// express middleware
app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://webmoblie:webmoblie@cluster0.pucpolg.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const categoriesCollection = client.db("webmoblie").collection("categories");
const allphonesCollection = client.db("webmoblie").collection("allphones");
const allordersCollection = client.db("webmoblie").collection("allorders");
const paymentCollection = client.db("webmoblie").collection("payment");
const userCollection = client.db("webmoblie").collection("user");

const run = () => {
    try {

        //// get all categories
        app.get('/categories', async (req, res) => {
            const result = await categoriesCollection.find({}).toArray();
            res.send(result);
        })

        // get  phones by category
        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };;
            const phonecategory = await categoriesCollection.findOne(query)
            const phonequery = { category: phonecategory.category };
            const phones = await allphonesCollection.find(phonequery).toArray();
            res.send(phones);
        })
        /// all orders api
        app.post('/allorders', async (req, res) => {
            const order = req.body;
            const result = await allordersCollection.insertOne(order);
            res.send(result);
        });

        // get simgle phone user data by gmail
        app.get('/allorders', async (req, res) => {
            const query = { email: req.query.email };
            const result = await allordersCollection.find(query).toArray();
            res.send(result);
        })
        app.get('/sellerorder', async (req, res) => {
            const query = {selleremail: req.query.email };
            const result = await allordersCollection.find(query).toArray();
            res.send(result);
        })
        // get all orders by id 

        app.get('/payment/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };

            const result = await allordersCollection.findOne(query);

            res.send(result);
        })
        // add phones 
        app.post('/addphones', async (req, res) => {
            const phone = req.body;
            const result = await allphonesCollection.insertOne(phone);
            res.send(result);

        })
        // get all phones

        app.get('/allphones/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allphonesCollection.findOne(query)
            res.send(result);
        })


 

    } finally {

    }

}
run()

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



















// api for all products
