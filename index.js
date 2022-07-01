const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yhm1t.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log("db connected")

        const taskCollection = client.db('task-management').collection('tasks')
        const completeTaskCollection = client.db('task-management').collection('complete_task')

        app.post('/task', async (req, res) => {
            const task = req.body
            const result = await taskCollection.insertOne(task)
            res.send(result)
        })

        app.get('/task', async (req, res) => {
            const tasks = await taskCollection.find().toArray()
            res.send(tasks)
        })

        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await taskCollection.deleteOne(filter)
            res.send(result)
        })

        app.put('/task/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const task = req.body
            const options = { upsert: true };
            const updateDoc = {
                $set: task
            }
            const result = await taskCollection.updateOne(filter, updateDoc, options);
            res.send(result)

        })

        app.post('/completeTask', async (req, res) => {
            const completeTask = req.body
            const result = await completeTaskCollection.insertOne(completeTask)
            res.send(result)
        })

        app.get('/completeTask', async (req, res) => {
            const tasks = await completeTaskCollection.find().toArray()
            res.send(tasks)
        })

    }
    finally {

    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello From Task Management Tool :)')
})

app.listen(port, () => {
    console.log('Task Mangement Tool, Listening to port', port)
})