import { createClient } from 'redis';
import dotenv from 'dotenv'
dotenv.config()

const client = await createClient({
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: 12824
    }
});

client.on('error', (err) => console.log('Redis Client Error', err));
await client.connect();


