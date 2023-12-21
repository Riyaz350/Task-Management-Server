const express = require('express')
require('dotenv').config();
const cors = require('cors')
// const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors({

    origin:[ 'http://localhost:5173',
            'http://localhost:5174',
            'https://6568263afe8d95692e5ee16a--cute-vacherin-eb6d20.netlify.app'
           ],
    credentials:true

}
))


const { MongoClient, ServerApiVersion } = require('mongodb');
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

    // USERS

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
