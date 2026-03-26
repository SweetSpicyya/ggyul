require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

const client = new MongoClient(uri);

// 3. API 엔드포인트 작성
app.get('/api/user', async (req, res) => {
  try {
    await client.connect();

    const database = client.db('ggyual_database');
    const collection = database.collection('user');

    const products = await collection.find({}).toArray();

   res.status(200).json(products);
  } catch (error) {
    console.error("데이터 불러오기 에러:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다.", error: error.message });
  } finally {
    await client.close();
  }
});

// 4. 서버 실행
app.listen(port, () => {
  console.log(`✅ 백엔드 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
