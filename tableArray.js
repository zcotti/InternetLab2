// const { Client } = require('pg');

// // Подключение к PostgreSQL
// const client = new Client({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'postgres',
//   password: '2002',
//   port: 5432
// });

// client.connect();


// const getTable = async () => {
    
//     const query = 'SELECT name, price, time FROM services';
//     const result = await client.query(query);

//     const data = result.rows;
    

// };


// // Выполнение SQL-запросов
// client.query('SELECT name, price, time FROM services', (err, res) => {
//   if (err) throw err;
//   console.log(res.rows);
  
//   // Закрытие подключения
//   client.end();
// });


// const data = { q1: 'a1', 
//                 q2: 'a1', 
//                 q3: 'a3' };

// for (const key in data) {
//   if (data.hasOwnProperty(key)) {
//       console.log(data[key]);
//   }
// }


let time = ["9:00", "9:30", "10:00", "10:30","11:00","11:30", "12:00","12:30","13:00","13:30", "14:00","14:30","15:00","15:30","16:00",  "16:30", "17:00", "17:30", "18:00"]; 

const data = [
    "15:00",
    "12:00",
    "12:30",
    "13:00"
];
let a = data[3];
console.log(a);

console.log(time[a]);