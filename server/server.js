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
let database;

async function connectDB(){
  try {
    await client.connect();
    database = client.db('ggyual_database');
  }catch (e) {
    console.error("fail to connect DB :", e);
  }
}
connectDB().catch();

app.get('/api/products', async (req, res) => {
  try {
    const collection = database.collection('product');
    const products = await collection.find({}).sort({ _id: -1 }).toArray();

    res.status(200).json(products);

    if(!products){
      return res.status(404).json({message: 'No product'});
    }
  } catch (e) {
    console.error("fail :", e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const collection = database.collection('product');

    const productData = await collection.findOne({_id: new ObjectId(productId)});

    if(!productData){
      return res.status(404).json({message: 'Cannot find the product'});
    }

   res.status(200).json(productData);
  } catch (e) {
    console.error("fail :", e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/registerproduct', async (req, res) => {
  try {
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
});

app.post('/api/favourites', async (req, res) => {
  const { productId, userId } = req.body;
  try{
    const collection = database.collection('favourite');

    const query = {
      user_id: userId,
      product_id: productId
    };

    const existing = await collection.findOne(query);

    if(existing){
      await collection.deleteOne({ _id: existing._id });
      res.status(200).json({ isFavourite: false });
    }else{
      await collection.insertOne({
        ...query,
        createdAt: new Date()
      });
      res.status(200).json({ isFavourite: true });
    }
  }catch (e){
    res.status(500).json({ message: e.message });
  }
});

app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const collection = database.collection('favourite');
    const favIds = await collection.distinct("product_id", { user_id: userId });

    res.status(200).json(favIds);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get('/api/filter/products', async (req, res) => {
  try {
    const { city, maxPrice, minPrice, condition } = req.query;
    let query = {};

    if (city) {
      query.location_name = { $regex: city, $options: 'i' };
    }

    if (maxPrice || minPrice) {
      query.price = { $lte: parseInt(maxPrice), $options: 'i' };
    }

    if (condition) {
      query.product_condition = { $regex: condition, $options: 'i' };
    }

    console.log(query)

    const collection = database.collection('product');
    const products = await collection.find(query).sort({ _id: -1 }).toArray();

    console.log(products)

    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


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


app.listen(port, () => {
  console.log(`✅ It's on http://localhost:${port}.`);
});

process.on('SIGINT', async () => {
  await client.close();
  console.log('Close MongoDB');
  process.exit(0);
})


