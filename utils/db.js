import { createClient } from "redis"

const client = await createClient({
    password: process.env.REDIS_PASS,
    socket: {
      host: process.env.REDIS_HOST,
      port: 12824,
    },
  });

client.connect()
if(client.connect){
    console.log('Redis connected succesfully')
}


export default client






