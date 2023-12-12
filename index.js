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
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err })
        })
}

// async function updateFeed(req, res) {
//     const currentDate = new Date();     // get current date
//     const combineData = { dateAdded: currentDate, ...req.body}
//     const id = new ObjectId(req.params.id)
//     db.collection('plants')
//         .findOneAndUpdate(
//             { _id: id },
//             { $push: combineData }
//         )
//         .then(() => {
//             res.status(200).send({ message: 'Update plant', success: true });
//         })
//         .catch((err) => {
//             res.status(500).send({ message: 'Error updating plant', success: false });
//         });
// }


const PORT = process.env.PORT || 5001
const app = express();

app.use(cors());    // this is so we can use cors to connect to the front end 
app.use(express.json()); // this is so we can use req.body in our functions 

app.get('/plants', getAllPlants)  // this is the route for getting all the plants from the database and sending them to the front end

app.post('/plants', addPlant) // this is the route for adding a new plant to the database and updating the front end with a new plant
//app.patch('/plants/:id', updateFeed)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})
