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


run()

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



















// api for all products
