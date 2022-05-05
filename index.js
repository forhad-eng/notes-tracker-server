const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.elrc8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

async function run() {
    try {
        await client.connect()
        const notesCollection = client.db('notesTracker').collection('notes')

        app.get('/notes', async (req, res) => {
            const query = req.query
            const cursor = notesCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/note', async (req, res) => {
            const note = req.body
            const result = await notesCollection.insertOne(note)
            res.send(result)
        })

        app.delete('/note/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await notesCollection.deleteOne(query)
            res.send(result)
        })
    } finally {
    }
}

run().catch(console.dir)

app.listen(port, () => {
    console.log('Listening to port', port)
})
