const coinContainer = document.getElementById("coin-container");
const shimmerContainer = document.querySelector(".shimmer-containier");
const coinImage = document.getElementById("coin-img");
const coinName = document.getElementById("coin-name");
const coinDescription = document.getElementById("coin-description");
const coinPrice = document.getElementById("coin-price");
const coinRank = document.getElementById("coin-rank");
const coinMarketCap = document.getElementById("coin-market-cap");
const coinChart = document.getElementById("coinChart");
const buttonContainer = document.querySelectorAll(".button-container button");

const options = {
  method: "GET",
  headers: {
    access: "application/json",
    "x-cg-demo-api-key": "CG-mDVVqLm5xBDjvcVq523LnAmB",
  },
};

const urlParam = new URLSearchParams(window.location.search);
const coinId = urlParam.get("id");

const fetchCoinData = async () => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}`,
      options
    );
    const coinData = await response.json();
    console.log(coinData);
    displayCoinsData(coinData);
  } catch (error) {
    console.log("Error while fetching Data", error);
  }
};

const displayCoinsData = (coinData) => {
  console.log(coinData.image.large);
  coinImage.src = coinData.image.large;
  coinImage.alt = coinData.name;
  coinDescription.textContent = coinData.description.en.split(".")[0];
  coinRank.textContent = coinData.market_cap_rank;
  coinName.textContent = coinData.name;
  coinPrice.textContent = `$${coinData.market_data.current_price.usd.toLocaleString()}`;
  coinMarketCap.textContent = `$${coinData.market_data.market_cap.usd.toLocaleString()}`;
};

const coinsChart = new Chart(coinChart, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Price (USD)",
        data: [],
        borderWidth: 2,
        borderColor: "#eebc1d",
      },
    ],
  },
});

const fetchChartData = async (days) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      options
    );
    const chartData = await response.json();
    updateChart(chartData.prices);
  } catch (error) {
    console.log("Error while fetching chart data", error);
  }
};

const updateChart = (prices) => {
  const data = prices.map((price) => price[1]);
  const labels = prices.map((price) => {
    let date = new Date(price[0]);
    return date.toLocaleDateString();
  });

  coinsChart.data.labels = labels;
  coinsChart.data.datasets[0].data = data;
  coinsChart.update();
};

buttonContainer.forEach((button) => {
  button.addEventListener("click", (event) => {
    const days =
      event.target.id === "24h" ? 1 : event.target.id === "30d" ? 30 : 90;
    fetchChartData(days);
  });
});
document.addEventListener("DOMContentLoaded", async () => {
  await fetchCoinData();


  document.getElementById('24h').click();
});
