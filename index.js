import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { MongoClient } from 'mongodb';
console.log (process.env.MONGO_URI)
const client = new MongoClient(process.env.MONGO_URI)
await client.connect()
.catch(console.error)
    
  const db = client.db('SowTropical')
   function getAllPlants(req, res){
    db.collection('plants').find({}).toArray() 
        .then(plants => {
            res.send(plants)
        })
        .catch(err => {
            res.status(500).send({success: false, mesaage: err })
        })

}   
function addPlant(req, res){
    const newPlant = req.body
    db.collection('plants').insertOne(newPlant)
        .then(() => {
           getAllPlants(req, res)
            // res.status(201).send({ message: "Plant added", success: true })
        })
        .catch(err => {
            res.status(500).send({ success: false, message: err })
        })

}



const PORT = process.env.PORT || 5001
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');

})

app.get('/api', (req, res) => {
    res.send('Hello API');
})

app.get('/api/users', (req, res) => {
    res.send('Hello Users');

})

app.get('/plants', (req, res) => {
    getAllPlants(req, res)


})
    app.post('/plants', (req, res) => {
        addPlant(req, res)
    })


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})
