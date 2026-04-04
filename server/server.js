require('dotenv').config();

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

const client = new MongoClient(uri);

app.get('/api/product/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    await client.connect();

    const database = client.db('ggyual_database');
    const collection = database.collection('product');

    const productData = await collection.findOne({_id: new ObjectId(productId)});

    if(!productData){
      return res.status(404).json({message: 'Cannot find the product'});
    }

   res.status(200).json(productData);
  } catch (e) {
    console.error("fail :", error);
    res.status(500).json({ error: e.message });
  } finally {
    await client.close();
  }
});

app.post('/api/registerproduct', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('ggyual_database');
    const collection = database.collection('product');

    const update_pData = {
      title: req.body.title,
      city_name: req.body.city,
      location_name: req.body.location,
      product_condition: req.body.condition,
      giveaway: req.body.giveaway,
      year_purchase: req.body.year,
      price: req.body.price,
      date_avaliable: req.body.available,
      user_id: 1111,
      createdAt: new Date()
    };
    const result = await collection.insertOne(pData);

    res.status(201).json({
      message: "Successd to save!",
      insertedId: result.insertedId,
      data: pData
    });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
})


app.put('/api/updateproduct/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    await client.connect();
    const database = client.db('ggyual_database');
    const collection = database.collection('product');

    const pData = {
      title: req.body.title,
      city_name: req.body.city,
      location_name: req.body.location,
      product_condition: req.body.condition,
      giveaway: req.body.giveaway,
      year_purchase: req.body.year,
      price: req.body.price,
      date_avaliable: req.body.available,
      user_id: 1111,
      createdAt: new Date()
    };

    const result = await collection.updateOne(
      {_id: new ObjectId(productId)},
    { $set: pData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Fail to find the product" });
    }

    res.status(201).json({
      message: "Successd to update!", result
    });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
})

app.post('/api/user/register',async(req,res)=>{
  try{
    await client.connect();
    const database = client.db('ggyual_database');
    const collection = database.collection('user');

    const newUser = req.body;
    const result = await collection.insertOne(newUser);
    console.log("success register : ", result.insertedId);
    res.status(201).json({ message: "new register!", id: result.insertedId });
  } catch (error){
    console.log('register error : ', error);
    res.status(500).json({message:"fail to save", error:error.message})
  } finally{
    // await client.close();
  }
});

app.post('/api/user/emailCheck',async(req,res)=>{
  try{ 
    await client.connect();
    const database = client.db('ggyual_database');
    const collection = database.collection('user');

    const {email} = req.body;
    
    const result = await collection.findOne({email:email});
    console.log("success register : ", result);
  
    if(result){
      return res.status(200).json({exists:false, message:"email is already taken!"});
    } else {
      return res.status(200).json({exists:true, message:"email is available."});
    }
  } catch (error){
    console.log('register error : ', error);
    res.status(500).json({message:"fail to save", error:error.message})
  } finally{
    // await client.close();
  }
});
app.post('/api/user/login',async(req,res)=>{
  try{ 
    await client.connect();
    const database = client.db('ggyual_database');
    const collection = database.collection('user');

    const {email,password} = req.body;
    
    const result = await collection.findOne({email, password});
    console.log("login success : ", result);
  
    if(result){
      return res.status(200).json({success:true, message:"login Success", loginData : result});
    } else {
      return res.status(200).json({success:false, message:"doesn't have login data"});
    }
  } catch (error){
    console.log('register error : ', error);
    res.status(500).json({message:"login error", error:error.message})
  } finally{
    // await client.close();
  }
});
app.put('/api/user/updateProfile',async(req,res)=>{
  try{
    await client.connect();
    const database = client.db('ggyual_database');
    const collection = database.collection('user');

    const { _id, email, first_name, last_name, birth_date, password } = req.body;
    
    const result = await collection.updateOne({_id:new ObjectId(_id)},
    {
      $set : {
        email,
        first_name,
        last_name,
        birth_date,
        password
      }
    });
    if(result.matchedCount == 0){
      return res.status(404).json({success:false, message:"user not found"});
    }
    res.status(201).json({success:true, message:"profileUpdate",data : result});
    console.log("login success : ", result);
  } catch(error){
    console.log('update error', error);
    res.status(500).json({success:false, message:error.message});
  } finally{

  }
})

// 4. 서버 실행
app.listen(port, () => {
  console.log(`✅ It's on http://localhost:${port}.`);
});


