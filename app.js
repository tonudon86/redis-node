const express = require("express");
const app = express();
const port = 3002;
const axios = require("axios");
const redis = require('redis');
 
const client = redis.createClient();

(async () => {
    await client.connect();
})();
client.on('error', err => {
    console.log('Error ' + err);
});

client.on('connect', function() {
    console.log('Connected!');
 });



 
  
  app.get("/", async (req, res) => {
    try {
        const value = await client.get('data');
        
        let resData
        if(value !=null){
            resData=JSON.parse(value)
        }
        else {
            let resp = await axios.get("https://jsonplaceholder.typicode.com/todos");
            resData=resp.data
          
           
           client.set('data', JSON.stringify( resData));
        }
       
        res.json({data:resData});

    } catch (error) {
        res.json(error)
        console.log(error)
    }   

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
