import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch rates
  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((response) => response.json())
      .then((data) => {
        setRates(data.rates);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch exchange rates.");
        setLoading(false);
      });
  }, []);

  // Calculate result as derived state
  const result = 
    amount && !isNaN(amount) && fromCurrency !== toCurrency && rates[fromCurrency] && rates[toCurrency]
      ? ((amount / rates[fromCurrency]) * rates[toCurrency]).toFixed(2)
      : null;

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className="container">
      <div className="converter-box">
        <h1>Currency Converter</h1>

        {loading ? (
          <p>Loading exchange rates...</p>
        ) : (
          <>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <div className="dropdowns">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {Object.keys(rates).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>

              <button className="swap-btn" onClick={handleSwap}>
                🔁
              </button>

              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {Object.keys(rates).map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="error">{error}</p>}

            {result && (
              <h3 className="result">
                {amount} {fromCurrency} = {result} {toCurrency}
              </h3>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
