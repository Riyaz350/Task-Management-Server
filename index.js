const express = require('express')
require('dotenv').config();
const cors = require('cors')
// const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 5000


app.use(express.json())


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
