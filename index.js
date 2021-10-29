const express=require('express');
const app=express();
const port=5000;
const cors=require('cors');
              
const ObjectId=require('mongodb').ObjectId;

//middleware
app.use(cors());
app.use(express.json());


//mydbuser1
//ol9CQVZGSkmbCK2D
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://mydbuser1:ol9CQVZGSkmbCK2D@cluster0.mzc9x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
  try{
    await client.connect();
    const database=client.db('foodMaster');
    const usersCollection=database.collection('users');
    //GET API
    app.get('/users',async(req,res)=>{
      const cursor=usersCollection.find({});
      const users= await cursor.toArray();
      res.send(users);
    })

//update API(id diye kew re khuje ber kora)
    app.get('/users/:id', async(req,res)=>{

      const id=req.params.id;
      const query={_id:ObjectId(id)};
      const user=await usersCollection.findOne(query)
      res.send(user)
    })     

    //update API(update name,email)

    app.put('/users/:id',async(req,res)=>{
      const id=req.params.id;
      const updatedUser=req.body;
      const filter={_id:ObjectId(id)};
      const options={upsert:true};
      const updateDoc={
        $set:{
          name:updatedUser.name,
          email:updatedUser.email
        },
      };
      const result =await usersCollection.updateOne(filter,updateDoc,options)
      res.json(result);
    })




    //post API
    
    app.post('/users',async(req,res)=>{
      const newUser=req.body;
      const result=await usersCollection.insertOne(newUser);
      console.log('hitting the post ')
      res.json(result);
    });
    
    //delete API
    app.delete('/users/:id', async(req,res)=>{
      const id=req.params.id;
      const query={_id:ObjectId(id)}
      const result=await usersCollection.deleteOne(query);
      console.log(result)
      res.json(result);
    })


  }
  finally{
      // await client.close();
  }

}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Running my CRUD Server');
})
app.listen(port,()=>{
    console.log('Running Server on Port',port)
})