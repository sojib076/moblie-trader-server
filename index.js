const express = require('express');
const app = express();
const port = 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
jwt = require('jsonwebtoken');
// require stripe
const stripe = require('stripe')(process.env.stripecode_code);
/// express middleware
app.use(cors());
app.use(express.json());
// require dotenv
require('dotenv').config();


const uri = `mongodb+srv://${process.env.Dbuser}:${process.env.Dbpass}@cluster0.pucpolg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const categoriesCollection = client.db("webmoblie").collection("categories");
const allphonesCollection = client.db("webmoblie").collection("allphones");
const allordersCollection = client.db("webmoblie").collection("allorders");
const userCollection = client.db("webmoblie").collection("user");


console.log(uri);
function verifyjwt(req, res, next) {
  console.log(req.headers.authorization);
    const authheader = req.headers.authorization;
    if (!authheader) {
        return res.status(401).send('unauthorized access');
    }
    const token = authheader.split(' ')[1];
    jwt.verify(token, process.env.access_token, function (error, decoded) {
        if (error) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })
}

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
        // app.get('/sojib' ,async (req,res) => {
        //     const result = await allordersCollection.find({}).toArray();
        //     res.send(result);
        // })
        app.get('/sellerorder', async (req, res) => {
            const query = { selleremail: req.query.email };
            const result = await allphonesCollection.find(query).toArray();
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

        app.delete('/allphones/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            result = await allphonesCollection.deleteOne(query);
            res.send(result);
        })
        // get all phones
        app.post('/promote', async (req, res) => {
            const promote = req.body;
            const moblie = await allphonesCollection.updateOne({ _id: ObjectId(promote.id) }, { $set: { promote: "true" } })
            res.send(moblie);
            console.log(moblie);
        });
        app.get('/promote', async (req, res) => {
            const fillter = {
                promote: "true",
            }
            const result = await allphonesCollection.find(fillter).toArray();
            res.send(result);
        });


        app.post('/create-payment', async (req, res) => {
            const order = req.body;

            const price = order.resalePrice;
            const amount = price * 100;

            const paymentIntent = await stripe.paymentIntents.create({
                currency: 'usd',
                amount: amount,
                "payment_method_types": [
                    "card",
                ]
            })
            res.send({
                clientSecret: paymentIntent.client_secret
            });
        })

        app.post('/conpayment', async (req, res) => {
            const body = req.body;
            console.log(body.id);
            const moblie = await allphonesCollection.updateOne({ _id: ObjectId(body.orderid) }, { $set: { paid: "true" } })
            const result = await allordersCollection.updateOne({ _id: ObjectId(body.id) }, { $set: { paid: "true" } });
    
        })


        app.post('/addusers', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });
        app.get('/allusers', verifyjwt,async (req, res) => {
            
            const query = { email: req.query.email };
            if (req.query.email !== req.decoded.email) {
                    return res.status(403).send({ message: 'forbidden access' })
            }
            const result = await userCollection.findOne(query);
            //  console.log(result);
            res.send({ role: result.role });
        });
        
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            console.log(email);
            const query = { email: email };
            const user = await userCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.access_token)
                return res.send({ mTToken: token });
            }
            res.status(403).send({mTToken: '', message: 'You  are not allow ' })
        });


    } finally {

    }

}
run()

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



















// api for all products
