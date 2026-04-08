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
    if(database) console.log('Database connected');
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
    const prodCollection = database.collection('product');
    const userCollection = database.collection('user');

    const productData = await prodCollection.findOne({_id: new ObjectId(productId)});

    if(!productData){
      return res.status(404).json({message: 'Cannot find the product'});
    }

    const seller = await userCollection.findOne(
      { _id: new ObjectId(productData.user_id) },
      { projection: { password: 0, _id: 0 } }
    );

   res.status(200).json({
     ...productData,
     seller: seller || { name: 'Unknown User' }
   });
  } catch (e) {
    console.error("fail :", e);
    res.status(500).json({ error: e.message });
  }
});


app.get('/api/myproducts/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const collection = database.collection('product');

    const productData = await collection.find({ user_id: userId }).sort({ createdAt: -1 }).toArray();

    if(!productData){
      return res.status(404).json({message: 'Cannot find the product'});
    }

    res.status(200).json(productData);
  } catch (e) {
    console.error("fail :", e);
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/delete/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const prodCollection = database.collection('product');
    const favCollection = database.collection('favourite');

    const result = await prodCollection.deleteOne({ _id: new ObjectId(productId) });

    if (result.deletedCount === 1) {
      await favCollection.deleteMany({ product_id: productId });

      res.status(200).json({ message: "Successfully Deleted from both collections!" });
    } else {
      res.status(404).json({ message: "No item found to delete" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.post('/api/registerproduct', async (req, res) => {
  try {
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
      user_id: req.body.userId,
      createdAt: new Date()
    };
    const result = await collection.insertOne(pData);

    res.status(201).json({
      message: "Successd to save!",
      insertedId: result.insertedId
    });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


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

app.get('/api/favorites/products/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const favCollection = database.collection('favourite');
    const prodCollection = database.collection('product');

    const favIds = await favCollection.distinct("product_id", { user_id: userId });

    if (!favIds || favIds.length === 0) {
      return res.status(200).json([]);
    }

    const objectIds = favIds.map(id => new ObjectId(id));

    const favouriteProducts = await prodCollection
      .find({ _id: { $in: objectIds } })
      .toArray();

    res.status(200).json(favouriteProducts);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


app.post('/api/remove/favorites/products', async (req, res) => {
  const { productId, userId } = req.body;
  try {
    const collection = database.collection('favourite');

    const query = {
      user_id: userId,
      product_id: productId
    };

    const existing = await collection.findOne(query);

    if(existing){
      await collection.deleteOne({ _id: existing._id });
      res.status(200).json({ message: "Successfully Deleted from Favourite!" });
    }else{
      res.status(404).json({ message: "No item found to delete" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.get('/api/filter/products', async (req, res) => {
  try {
    const { location, minPrice, maxPrice, condition, sort } = req.query;
    let query = {};

    if (location) {
      query.location_name = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if(minPrice) query.price.$gte = parseInt(minPrice);
      if(maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    if (condition) {
      query.product_condition = parseInt(condition);
    }

    let sortQuery = { _id: -1};
    if(sort === 'priceLow'){
      sortQuery = {price: 1};
    }else if(sort === 'priceHigh'){
      sortQuery = {price: -1};
    }

    const collection = database.collection('product');
    const products = await collection.find(query).sort(sortQuery).toArray();

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

app.get('/api/user/allUser',async(req,res)=>{
  try{
    await client.connect();
    const database = client.db('ggyual_database');
    const collection = database.collection('user');

    const {admin,ageRange, itemCount, sortBy, order} = req.query;
    const pipeline = [
      {
        $addFields:{
          stringId : {$toString:'$_id'}
        }
      },
      {
        $lookup : {
          from : 'product',
          localField:'stringId',
          foreignField:'user_id',
          as:'userProducts'
        }
      },
      {
        $addFields:{
          itemCounter:{$size:'$userProducts'}
        }
      },
      {
        $project:{userProducts:0}
      }
    ];
    if (admin && admin !== '') {
      pipeline.push({ $match: { admin: admin } });
    }
    if (ageRange && ageRange !== '') {
      const currentYear = new Date().getFullYear();
      const targetAge = parseInt(ageRange);

      const minYear = currentYear - targetAge - 9; 
      const maxYear = currentYear - targetAge;

      pipeline.push({
        $match: {
          birth_date: {
            $gte: new Date(`${minYear}-01-01`),
            $lte: new Date(`${maxYear}-12-31`)
          }
        }
      });
    }
    if (itemCount && itemCount !== '') {
      const count = parseInt(itemCount);
      
      if (count === 40) {
        pipeline.push({ $match: { itemCounter: { $gte: 40 } } });
      } else {
        pipeline.push({ 
          $match: { 
            itemCounter: { $gt: count - 10, $lte: count } 
          } 
        });
      }
    }

    if (sortBy) {
      const sortStage = {};
      sortStage[sortBy] = order === 'desc' ? -1 : 1;
      pipeline.push({ $sort: sortStage });
    }
    
    const result = await collection.aggregate(pipeline).toArray();
    console.log("successfully selected : ", result);
    res.status(200).json({ message: "selected all user data !", result : result});
  } catch (error){
    console.log('register error : ', error);
    res.status(500).json({message:"fail to selected", error:error.message})
  } finally{
    // await client.close();
  }
});
app.put('/api/user/updateAdmin',async(req,res)=>{
  try{
    await client.connect();
    const database = client.db('ggyual_database');
    const collection = database.collection('user');

    const { _id, admin } = req.body;
    
    const result = await collection.updateOne({_id:new ObjectId(_id)},
    {
      $set : {
        admin
      }
    });
    if(result.matchedCount == 0){
      return res.status(404).json({success:false, message:"user not found"});
    }
    res.status(201).json({success:true, message:"admin Update",data : result});
    console.log("admin update success : ", result);
  } catch(error){
    console.log('admin update error', error);
    res.status(500).json({success:false, message:error.message});
  } finally{

  }
});
app.delete('/api/user/userDelete',async(req,res)=>{
  try{
    await client.connect();
    const database = client.db('ggyual_database');
    const collection = database.collection('user');
    const {_id} = req.query;
    const result = await collection.deleteOne({_id: new ObjectId(_id)})
    if (result.deletedCount === 1) {
      res.status(200).json({ success: true, message: 'successfully deleted' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch(error){
    console.log('delete user error ', error);
    res.status(500).json({success:false, message : error.message});
  }
  finally{

  }
})
app.post('/api/message/send',async(req,res)=>{
  try{
    await client.connect();
    const database = client.db('ggyual_database');
    const collection = database.collection('message');

    const newMessage = req.body;
    const result = await collection.insertOne(newMessage);
    console.log("message send : ", result.insertedId);
    res.status(201).json({ message: "new register!", id: result.insertedId });
  } catch (error){
    console.log('message send error : ', error);
    res.status(500).json({message:"fail to save", error:error.message})
  } finally{
    // await client.close();
  }
});
app.get('/api/message/getUserMessage',async(req,res)=>{
  try{
    await client.connect();
    const database = client.db('ggyual_database');
    const collection = database.collection('message');

    const {product_id, sender_id} = req.query;
    const pipeline = [];
    
    const matchCondition = {};
    if(product_id) matchCondition.product_id = product_id;
    if(sender_id) matchCondition.sender_id = sender_id;
    if (Object.keys(matchCondition).length > 0) {
      pipeline.push({ $match: matchCondition });
    }
    pipeline.push({
      $addFields:{
        sender_obj_id : {$toObjectId:'$sender_id' }
      }
    });
    pipeline.push({
      $lookup:{
        from:'user',
        localField:'sender_obj_id',
        foreignField:'_id',
        as:'senderInfo'
      }
    });
    pipeline.push({
      $project:{
        _id:1,
        content:1,
        product_id:1,
        sender_id:1,
        creation_time:1,
        senderFirstName:'$senderInfo.first_name',
        senderLasttName:'$senderInfo.last_name',
        senderEmail:'$senderInfo.email'
      }
    });
    const result = await collection.aggregate(pipeline).toArray();
    console.log("successfully get all message : ", result);
    res.status(200).json({ message: "selected all message data !", result : result});
  }catch(err){
    console.log('get all mesage error : ' + err);
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


