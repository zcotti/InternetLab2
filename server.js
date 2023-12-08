const pool = require('./DataBase');

const express = require('express');
const app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static("public"));


app.get('/index', async function (request, response) { 
    
    const sqlQuery = 'SELECT name, price, time FROM services'; 
 
    try {
        const results = await pool.query(sqlQuery);
        response.render('index', { 
            host: results.rows 
        });
    } catch (error) {
        console.log(error); 
    }
});

app.get('/yslugi', async function (request, response) { 
    const sqlQuery = 'SELECT name FROM services'; 

    try {
        const results = await pool.query(sqlQuery);
        response.render('yslugi', { 
            host: results.rows 
        });
    } catch (error) {
        console.log(error); 
    }
});


const timeServices = {
    'Маникюр': 50,
    'Выщипывание бровей': 30,
    'Стрижка Мужская': 45,
    'Стрижка Женская': 45,
    'Стрижка Детская': 45
}

// app.get('/yslugi', async function (requestm, response){
//     const sqlQuer = 'SELECT time FROM services';

//     try{
//         const result = await pool.query(sqlQuer);
//         const timeJson = result.rows;
//         response.json({timeJson});
//         console.log(response.json({timeJson}));

//     } catch (error) {
//         console.log(error);
//     }
// });

app.post('/submitServices', async (req, res) => {

    const {curname, phone, service, time} = req.body;

    const checkResult = await pool.query('SELECT * FROM busyservices WHERE starttime = $1', [time]);

    let endtime = timeServices[service];

    const ttt =  Number(time) + Number(endtime);
    if (checkResult.rowCount > 0) {
        res.status(409).send('Время уже занято'); 

    } else {
        res.status(200).send('Успешно добавлено');
        await pool.query('INSERT INTO busyservices (name, nameservices, starttime, endtime) VALUES ($1, $2, $3, $4)', [curname, service, time, ttt], (error) => {
        
        if (error) {
            throw error;
        }
        console.log('Data inserted');
        });
    }
});

app.get('/data', (req, res) => {
    pool.query('SELECT starttime, endtime FROM busyservices', (error, result) => {
      if (error) {
        res.status(500).json({ message: 'Error fetching data' });
        console.error('Error executing query:', error);
      } else {
        res.send(JSON.stringify(result.rows)); // Отправка данных клиенту в формате JSON
      }
    });
});


// app.post('/submitServices', async (req, res) => {

//     const {curname, phone, service, time} = req.body;
    
//     const checkResult = await pool.query('SELECT * FROM test WHERE time = $1', [time]);

//     if (checkResult.rowCount > 0) {
//         res.status(409).send('Время уже занято'); 

//     } else {
//         res.status(200).send('Успешно добавлено');
//         await pool.query('INSERT INTO test (name, phone, service, time) VALUES ($1, $2, $3, $4)', [curname, phone, service, time], (error) => {
        
//         if (error) {
//             throw error;
//         }
//         console.log('Data inserted');
//         });
//     }
// });

app.get('/', function (request, response) {
    response.render('authorization');
});

app.listen(3000);