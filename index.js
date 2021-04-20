const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require("body-parser");
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId =  require('mongodb').ObjectID;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//MongoDb requirements
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusterdb.rpg0k.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//MongoDb CRUD
client.connect(err => {
    console.log("error:", err)
    const serviceCollection = client.db("insuranceAgency").collection("services");
    const orderCollection = client.db("insuranceAgency").collection("orders");
    const reviewCollection = client.db("insuranceAgency").collection("reviews");
    const adminCollection = client.db("insuranceAgency").collection("admin");
    console.log("connected to MongoDb")

    //create services
    app.post('/addService', (req, res) => {
        const newService = req.body;
        console.log('adding new product',newService);
        serviceCollection.insertOne(newService)
        .then(result => {
            console.log('Inserted count',result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })

     //Read services
     app.get('/services', (req, res) => {
        serviceCollection.find()
        .toArray((err, items) => {
            res.send(items);
        })
    })

     //Delete service
     app.delete('/delete/:id', (req, res) => {
        serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0);
        })
    })

     //create orders
     app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        console.log('adding new product',newOrder);
        orderCollection.insertOne(newOrder)
        .then(result => {
            console.log('Inserted count',result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })

    //Read orders
    app.get('/orders', (req, res) => {
        orderCollection.find()
        .toArray((err, items) => {
            res.send(items);
        })
    })

     //create review
     app.post('/addReview', (req, res) => {
        const newReview = req.body;
        console.log('adding new review',newReview);
        reviewCollection.insertOne(newReview)
        .then(result => {
            console.log('Inserted count',result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })

    //Read orders
    app.get('/reviews', (req, res) => {
        reviewCollection.find()
        .toArray((err, items) => {
            res.send(items);
        })
    })

     //create admin
     app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        console.log('adding new admin',newAdmin);
        adminCollection.insertOne(newAdmin)
        .then(result => {
            console.log('Inserted count',result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })

    //Get Admins
    app.get('/admin', (req, res) => {
        adminCollection.find()
        .toArray((err, items) => {
            res.send(items);
        })
    })

    //Update order
    app.patch('/update/:id', (req, res) => {
        orderCollection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set : {status : req.body.updatedStatus}
        })
        .then(result => {
            res.send(result.modifiedCount > 0);
        })
    })


});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})