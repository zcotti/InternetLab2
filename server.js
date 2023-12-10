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
    'Маникюр': 55,
    'Выщипывание бровей': 35,
    'Стрижка Мужская': 35,
    'Стрижка Женская': 55,
    'Стрижка Детская': 35,
    'Укладка волос': 55,
    'Уход за волосами': 35,
    'Депиляция воском': 75,
    'Педикюр': 115,
    'Тонирование волос': 35,
    'Бритье мужской бороды': 55,
    'Удаление гель-лака': 35,
    'Наращивание ногтей': 135,
    'Мелирование волос': 115
}


app.post('/submitServices', async (req, res) => {

    const {curname, phone, service, time} = req.body;

    const checkResult = await pool.query('SELECT * FROM serviceentries WHERE starttime = $1', [time]);

    let timik = timeServices[service];
    const endtime =  Number(time) + Number(timik);

    const priceQuery = await pool.query('SELECT price FROM services WHERE name = $1', [service]);
    const prices = priceQuery.rows;
    const price = prices[0].price;

    if (checkResult.rowCount > 0) {
        res.status(409).send('Время уже занято'); 

    } else {
        res.status(200).send('Успешно добавлено');
        await pool.query('INSERT INTO serviceentries (nameuser, phone, nameservices, price, starttime, endtime) VALUES ($1, $2, $3, $4, $5, $6)', 
        [curname, phone, service, price , time, endtime], (error) => {
        
        if (error) {
            throw error;
        }
        console.log('Data inserted');
        });
    }
});

app.get('/checkTime', (req, res) => {
    pool.query('SELECT starttime, endtime FROM serviceentries', (error, result) => {
      if (error) {
        res.status(500).json({ message: 'Error fetching data' });
        console.error('Error executing query:', error);
      } else {
        res.send(JSON.stringify(result.rows)); 
      }
    });
});

app.get('/', function (request, response) {
    response.render('main');
});

app.listen(3000);