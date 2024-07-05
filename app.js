const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": "CG-mDVVqLm5xBDjvcVq523LnAmB",
  },
};

let coins = [];
let currentPage = 1;
let itemsPerPage = 15;
const paginationContainer = document.getElementById("pagination");
const sortPriceAsc = document.getElementById("sort-price-asc");
const sortPriceDesc = document.getElementById("sort-price-desc");
const searchBox = document.querySelector(".search-box");
// let favorites = [];

const fetchCoins = async () => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1",
      options
    );
    // console.log(response.json);
    const coinsData = await response.json();
    return coinsData;
  } catch (error) {
    console.log(error);
  }
};

const getFavoriteCoins = () => {
  return JSON.parse(localStorage.getItem("favorites")) || [];
};

const saveFavoritecoins = (favorites) => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

const handleFavorite = (coinId) => {
  let favorites = getFavoriteCoins();
  if (favorites.includes(coinId)) {
    favorites = favorites.filter((id) => id !== coinId);
  } else {
    favorites.push(coinId);
  }
  saveFavoritecoins(favorites);
  displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
};

const sortCoinsByPrice = (order) => {
  if (order == "asc") {
    coins.sort((a, b) => a.current_price - b.current_price);
  } else if (order == "desc") {
    coins.sort((a, b) => b.current_price - a.current_price);
  }
  currentPage = 1;
  displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
  renderPagination(coins);
};

sortPriceAsc.addEventListener("click", () => {
  sortCoinsByPrice("asc");
});
sortPriceDesc.addEventListener("click", () => {
  sortCoinsByPrice("desc");
});

// search functionality
const searchCoins = () => {
  let searchQuery = document.getElementById("search").value.trim();
  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  currentPage = 1;
  displayCoins(getCoinsToDisplay(filteredCoins, currentPage), currentPage);
  renderPagination(filteredCoins);
};

searchBox.addEventListener("input", searchCoins);

function displayCoins(coins, currentPage) {
  let favorites = getFavoriteCoins();
  let start = (currentPage - 1) * itemsPerPage + 1;
  let tableBody = document.getElementById("crypto-table-body");
  tableBody.innerHTML = "";
  coins.forEach((coin, index) => {
    const row = document.createElement("tr");
    const isFavorite = favorites.includes(coin.id);
    row.innerHTML = `
        <tr>
            <td>${index + start}</td>
            <td><img src=${coin.image} alt="" width="24" height="24"></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price}</td>
            <td>$${coin.total_volume}</td>
            <td>$${coin.market_cap}</td>
            <td> <i class="fa-solid fa-star favorite-icon ${
              isFavorite ? "favorite" : ""
            }" data-id="${coin.id}" ></i></td>
        </tr>`;

    row.addEventListener("click", () => {
      window.open(`coin.html?id=${coin.id}`, "_blank");
    });

    row.querySelector(".favorite-icon").addEventListener("click", (event) => {
      event.stopPropagation();
      // console.log(coin.id);
      handleFavorite(coin.id);
    });

    tableBody.appendChild(row);
  });
}

const shimmerShow = () => {
  document.querySelector(".shimmer-container").style.display = "block";
};

const shimmerHide = () => {
  document.querySelector(".shimmer-container").style.display = "none";
};

const getCoinsToDisplay = (coins, page) => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return coins.slice(start, end);
};

const renderPagination = (coins) => {
  const totalPages = Math.ceil(coins.length / itemsPerPage);
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.classList.add("page-button");
    if (i == currentPage) {
      pageBtn.classList.add("active");
    }
    pageBtn.addEventListener("click", () => {
      currentPage = i;
      displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);

      updatePaginationButtons();
    });
    paginationContainer.appendChild(pageBtn);
  }
};

const updatePaginationButtons = () => {
  const pageBtns = document.querySelectorAll(".page-button");
  pageBtns.forEach((button, index) => {
    if (index + 1 == currentPage) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  shimmerShow();
  coins = await fetchCoins();
  displayCoins(getCoinsToDisplay(coins, currentPage), currentPage);
  renderPagination(coins);
  shimmerHide();
});
