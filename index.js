const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');

const ObjectId = require('mongodb').ObjectID;
var cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000

// caHtNLdI9moR0XEg



const uri = "mongodb+srv://thohidul:caHtNLdI9moR0XEg@cluster0.jna2fhs.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

   try{
    await client.connect();
    const userCollection = client.db("foodExpress").collection("user");

    // get method user for finding all data from database
    app.get('/user',async(req, res)=>{
        const query = {};
        const cursor = userCollection.find(query);
        const users = await cursor.toArray()
        res.send(users);
    })
    // get method user for finding single data from database
    app.get('/user/:id', async (req, res) => {
      const id = req.params.id
      const query = {_id:ObjectId(id)}
      const result = await userCollection.findOne(query);
      res.send(result);
    })

    // update a single user information from here

    app.put('/user/:id',async(req, res)=>{
      const id = req.params.id;
      const updateUser = req.body;
      const filter = {_id:ObjectId(id)}
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name : updateUser.name,
          email : updateUser.email
        }
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    //post method for find client side user added by user
    app.post("/user",async(req, res)=>{
        const newUser = req.body;
        console.log(newUser,'user added')
        const result = await userCollection.insertOne(newUser);
        console.log(`A document was inserted  _id: ${result.insertedId}`);
        res.send(result)
    })

    //delete a user
    app.delete("/user/:id",async(req, res)=>{
      const id = req.params.id;
      const query ={_id:ObjectId(id)}
      const result = await userCollection.deleteOne(query);
      res.send(result);

    })
    
   }

   finally {
    // await client.close();
  }

   
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})