import express from "express";
import userRoutes from './routes/userRoutes.js';
import db from './utils/db-firestore.js'
import client from "./utils/db.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', userRoutes)

app.listen(port, async () => {
  (async() => {

    const data = await client.get('mahasiswa')
    if(!data){
    const query = await db.collection('mahasiswa2').get()
    const data = JSON.stringify(query.docs.map((doc) => {
      return {
        nim : doc.data().nim,
        password : doc.data().password
      }
    }))
    await client.set('mahasiswa', data);
    console.log('Data saved to redis');
    }
  })()
  console.log(`Server is running on port ${port}`);
});
