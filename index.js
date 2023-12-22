const express = require('express')
require('dotenv').config();
const cors = require('cors')
// const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors({  origin:[ 'http://localhost:5173', 'http://localhost:5174'],
    credentials:true
}
))


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gx7mkcg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const users = client.db("Task-Management").collection("users");
    const tasks = client.db("Task-Management").collection("tasks");

    // USERS

    app.get('/users', async(req, res)=>{
        const result = await users.find().toArray()
        res.send(result)
      })

    app.post(`/users`, async(req, res)=>{
        const user = req.body
        console.log(user)
        const query = {email : req.body.email} 
        const find = await users.findOne(query)
        if(find){
          return res.send  ({message: 'user already exists', insertedId : null})
        }
        const result = await users.insertOne(user)
        res.send(result)
      })

    app.get('/user/:email', async(req, res)=>{
        const userEmail = req.params?.email
        const query = {email: userEmail }
        const result = await users.findOne(query)
        res.send(result)
    })

    // TASK

    app.post('/tasks', async(req, res)=>{
      const task = req.body
      const result = await tasks.insertOne(task)
        res.send(result)
    })

    app.get('/tasks', async(req, res)=>{
      const result = await tasks.find().toArray()
      res.send(result)
    })

    app.put('/task',  async(req, res)=>{ 
    const id = req.query._id
    console.log(id)
    const query = {_id: new ObjectId(id)}
    const options = { upsert: true };
    const updateTask = req.body
    const task = {
      $set:{
        title: updateTask.title,
        difficulty: updateTask.difficulty,
        date: updateTask.date,
        description: updateTask.description,
      }
    }
    const result = await tasks.updateOne(query, task, options)
        res.send(result)
  })

  app.delete('/tasks/:id', async(req, res)=>{
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    const result = await tasks.deleteOne(query);
    res.send(result)
})


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
} finally {
      
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Task time running out')
})


app.listen(port, ()=>{
    console.log(`Tasklord is sitting on port ${port} `)
})
