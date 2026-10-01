const fs = require('fs');
const http = require('http');
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

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview-template.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product-template.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/card-template.html`,
  'utf-8'
);
function replaceHTML(temp, product) {
  let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace('{%DESCRIPTION%}', product.description);
  if (!product.organic) {
    output = output.replace('{%NOT_ORGANIC%}', 'not-organic');
  }

  return output;
}

const API_DATA = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(API_DATA);

const cardHTML = dataObj.map((el) => replaceHTML(tempCard, el));
console.log(cardHTML);
const server = http.createServer((req, res) => {
  const pathName = req.url;

  //OVERVIEW
  if (pathName === '/' || pathName === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end(tempOverview.replace(/{%PRODUCT_CARD%}/g, cardHTML));
  }

  //PRODUCT
  else if (pathName === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end(tempProduct);
  }

  //API
  else if (pathName === '/api') {
    res.end(API_DATA);
  }

  //NOT FOUND
  else {
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
