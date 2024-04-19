const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// satirtharoy2003
// himu2003


let users = [
  {
    name: 'magi',
    number: 8801423423,
  },
  {
    name: 'khanki',
    number: 8801423423,
  }
]




const uri = "mongodb+srv://satirtharoy2003:himu2003@mydatabase.ofrvnz1.mongodb.net/?retryWrites=true&w=majority&appName=mydatabase";

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

    const database = client.db("userDB");
    const user = database.collection("user");

    app.get('/', (req, res)=> {
      res.send('onlymagi');
    })
    
    app.get('/users', async(req, res) => {
      const cursor = user.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/update/:name', async(req, res) => {
      const name = req.params.name;
      const query = {name: name}
      const suser = await user.findOne(query);
      console.log(suser);
      res.send(suser);
    })

    app.post('/users', async(req, res) => {
      console.log('ouch');
      console.log(req.body);
      users.push(req.body);
      
      const resutlt = await user.insertOne(req.body);
      res.send(resutlt);
    })

    app.put('/update/:name', async(req, res) => {
      const name = req.params.name;
      const updatedUser = req.body;
      console.log(updatedUser, name);
      const filter = {name: name};
      const option = {upsert : true};
      const updatedDoc = {
        $set: {
          name: updatedUser.name,
          phone: updatedUser.phone
        }
      }
      const result = await user.updateOne(filter, updatedDoc, option);
      res.send(result);
    })

    app.delete('/users', async(req, res) => {
      const query = { name: req.body.name };
      const result = await user.deleteOne(query);
      res.send(result)
    })


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// app.get('/', (req, res)=> {
//   res.send('onlymagi');
// })

// app.get('/users', (req, res) => {
//   res.send(users);
// })

app.post('/users', (req, res) => {
  console.log('ouch');
  console.log(req.body);
  users.push(req.body);
  res.send(req.body);
})

app.delete('/users', (req, res) => {
  console.log('entered delete operation');
  console.log(req.body);
  users = users.filter(u => u.name !== req.body.name)
  res.send(req.body);
})

app.listen(port, ()=> {
  console.log(`server is running on port ${port}`);
});