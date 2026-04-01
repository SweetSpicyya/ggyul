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
    await client.close();
  }
})

// 4. 서버 실행
app.listen(port, () => {
  console.log(`✅ It's on http://localhost:${port}.`);
});


