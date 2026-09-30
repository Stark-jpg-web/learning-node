const fs = require('fs');
const http = require('http');
const { stringify } = require('querystring');
const url = require('url');

///////FILES////////

//i/o non blocking /async

/* fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    if (err) return console.log('Error ❌ :', err);

    fs.readFile(`./txt/${data1}.txt`, `utf-8`, (err, data2) => {
        console.log(`this is data2 : ${data2}`);
        fs.readFile(`./txt/append.txt`, `utf-8`, (err, data3) => {
            console.log(`this is data3 : ${data3}`);
            fs.writeFile(`./txt/final.txt`,`This is data 1 ${data1}\nThis is Data 2 ${data2}\nThis is data 3 ${data3}\n this is ${data2} ... ${data3}`,(err)=>{
                if(err) throw err;
                console.log('Write file completed 👍');
            })
        })
    })

   
});
console.log('this will print first'); */

////////SERVER and basic ROUTING////////

//Read API_DATA using sync instead of async so that the api gets called once and the data gets stored in a variable.
const API_DATA = fs.readFileSync(`${__dirname}/dev-data/data.json`, `utf-8`);
const dataObj = JSON.parse(API_DATA);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === '/' || pathName === '/overview') {
    res.end('This is OVERVIEW page 😍');
  } else if (pathName === '/product') {
    res.end('This is PRODUCT page 😍');
  } else if (pathName === '/api') {
    res.end(API_DATA);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log(
    'Server started successfully at http://localhost:8000 / 127.0.0.1 ... port:8000'
  );
});
