const express = require('express');
const axios = require('axios')
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json())
const accessToken = 'f211e11f64c018fa0809acf039a3110c'
const baseURL = 'http://data.fixer.io/api/latest?access_key='

let rates = [];

app.post('/convert', (req, res) => {
    const { id } = req.params;
    const { fromCurrency, amount, toCurrency } = req.body;

    console.log(`${baseURL}${accessToken}&base${fromCurrency}&symbols${toCurrency}`)

    rates?.map(rates => {
        
    })
    axios.get(`${baseURL}${accessToken}&base=${fromCurrency}&symbols=${toCurrency}`)
    .then(res => {
        rates.push(res.data)
        console.log(res.data)
    }) .catch (console.error);

    // {
    //     "amount": 1.20343267683,
    //     "currency": "USD"
    // }

    if (!fromCurrency) {
        res.status(418).send({ message: 'Please update the Base Currency'})
    } else if (!toCurrency) {
        res.status(418).send({ message: 'Please update the To Currency'})
    } else if (!amount) {
        res.status(418).send({ message: 'Please update the amount'})
    }

    res.send({
        amount,
        currency : toCurrency
    })
})

app.listen(
    PORT,
    () => console.log(`It's live on http://localhost:${PORT}`)
)
