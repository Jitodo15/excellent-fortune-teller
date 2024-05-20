import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import cors from 'cors';
import env from 'dotenv';

const app = express();
const port = 3000;
env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT

});


db.connect();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())


app.post("/start-conversation", (req, res) => {
    req.session.state = 'initial';
    res.json({ message: "Hello. Are you having a good day?" });
});

app.post("/check-response", async(req,res) =>{
    const userResponse = req.body.message;

    try{
        const goodWords = await db.query("SELECT word FROM positive_words");
        const badWords = await db.query("SELECT word FROM negative_words");

        let goodCount = 0;
        let badCount = 0;

        userResponse.split(' ').forEach(word => {
            if (goodWords.rows.includes(word.toLowerCase())) {
              goodCount++;
            }
            if (badWords.rows.includes(word.toLowerCase())) {
              badCount++;
            }
        });

        let fortune;
        if (goodCount > badCount) {
          const goodFortuneResult = await db.query('SELECT fortune FROM good_fortunes ORDER BY RANDOM() LIMIT 1');
          fortune = goodFortuneResult.rows[0].fortune;
        } else if (badCount > goodCount) {
          const badFortuneResult = await db.query('SELECT fortune FROM bad_fortunes ORDER BY RANDOM() LIMIT 1');
          fortune = badFortuneResult.rows[0].fortune;
        } else {
          const mixedFortunesQuery = `
            SELECT fortune FROM (
              SELECT fortune FROM good_fortunes
              UNION ALL
              SELECT fortune FROM bad_fortunes
            ) AS all_fortunes
            ORDER BY RANDOM() LIMIT 1
          `;
          const mixedFortuneResult = await db.query(mixedFortunesQuery);
          fortune = mixedFortuneResult.rows[0].fortune;
          res.json({ response: fortune });
          
        }
        

    } catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
   

});

app.listen(port, () =>{
    console.log(`Server running on port ${port}`);
});