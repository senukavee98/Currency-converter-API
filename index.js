const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
const accessToken = "f211e11f64c018fa0809acf039a3110c";
const baseURL = "http://data.fixer.io/api/latest?access_key=";
const baseCurrency = "EUR";
let cachedCurrencies;
let timestamp = 0;
const secondsPerDay = 86400;
const currentTimeStamp = Math.round(Date.now() / 1000);

const handleCurrencyConversion = (
  response,
  fromCurrency,
  amount,
  toCurrency
) => {
  if (
    !fromCurrency ||
    fromCurrency.length !== 3 ||
    typeof fromCurrency !== "string"
  ) {
    response.status(400).send({ message: "Invalid base currency" });
  } else if (
    !toCurrency ||
    toCurrency.length !== 3 ||
    typeof toCurrency !== "string"
  ) {
    response.status(400).send({ message: "Invalid to currency" });
  } else if (!amount || isNaN(amount)) {
    response.status(400).send({ message: "Invalid amount" });
  }

  const fromCurrencyRate = cachedCurrencies[fromCurrency];
  const toCurrencyRate = cachedCurrencies[toCurrency];
  const convertedValue = (amount * toCurrencyRate) / fromCurrencyRate;
  response.status(200).send({
    amount: convertedValue.toFixed(2),
    currency: toCurrency,
  });
};

app.post("/convert", (req, res) => {
  const { fromCurrency, amount, toCurrency } = req.body;

  if (
    timestamp === 0 ||
    currentTimeStamp - timestamp > secondsPerDay ||
    !cachedCurrencies
  ) {
    axios
      .get(`${baseURL}${accessToken}&base=${baseCurrency}`)
      .then((response) => {
        timestamp = response.data.timestamp;
        cachedCurrencies = response.data.rates;
        handleCurrencyConversion(res, fromCurrency, amount, toCurrency);
      })
      .catch(console.error);
  } else {
    handleCurrencyConversion(res, fromCurrency, amount, toCurrency);
  }
});

app.listen(PORT, () => console.log(`It's live on http://localhost:${PORT}`));
