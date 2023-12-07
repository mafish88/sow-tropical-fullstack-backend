import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb'
console.log(process.env.MONGO_URI)
const client = new MongoClient(process.env.MONGO_URI)
await client.connect()
    .catch(console.error)

const db = client.db('SowTropical')
function getAllPlants(req, res) {
    db.collection('plants').find({}).toArray()
        .then(plants => {
            res.send(plants)
        })
        .catch(err => {
            res.status(500).send({ success: false, mesaage: err })
        })
}

function addPlant(req, res) {
    const newPlant = req.body
    db.collection('plants').insertOne(newPlant)
        .then(() => {
            getAllPlants(req, res)
           res.status(201).send({ message: "Plant added", success : true })
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err })
        })
}

async function updateFeed(req, res) {
    const currentDate = new Date();
    const combineData = { dateAdded: currentDate, name: req.body.name }
    const id = new ObjectId(req.params.id)
    db.collection('plants')
        .findOneAndUpdate(
            { _id: id },
            { $push: { feed: combineData } }
        )
        .then(() => {
            res.status(200).send({ message: 'Fertilizer added successfully', success: true });
        })
        .catch((err) => {
            res.status(500).send({ message: 'Error adding fertilizer', success: false });
        });
}


const PORT = process.env.PORT || 5001
const app = express();

app.use(cors());
app.use(express.json());

app.get('/plants', getAllPlants)

app.post('/plants', addPlant)
app.patch('/plants/:id', updateFeed)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})
