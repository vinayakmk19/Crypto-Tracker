const shimmerContainer = document.querySelector(".shimmer-container");
const paginationContainer = document.getElementById("pagination");
let itemsPerPage = 15;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": "CG-mDVVqLm5xBDjvcVq523LnAmB",
  },
};

const getFavoriteCoins = () => {
  return JSON.parse(localStorage.getItem("favorites")) || [];
};

const fetchFavoriteCoins = async (coinIds) => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(
        ","
      )}`,
      options
    );
    const coinsData = await response.json();
    return coinsData;
  } catch (error) {
    console.log("Error while fetching coins", error);
  }
};

const displayFavoriteCoins = (favCoins) => {
  let tableBody = document.getElementById("favorite-table-body");
  tableBody.innerHTML = "";
  favCoins.forEach((coin, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <tr>
              <td>${index + 1}</td>
              <td><img src=${coin.image} alt="" width="24" height="24"></td>
              <td>${coin.name}</td>
              <td>$${coin.current_price.toLocaleString()}</td>
              <td>$${coin.total_volume.toLocaleString()}</td>
              <td>$${coin.market_cap.toLocaleString()}</td>      
          </tr>`;

    row.addEventListener("click", () => {
      window.open(`coin.html?id=${coin.id}`, "_blank");
    });

    tableBody.appendChild(row);
  });
};

const shimmerShow = () => {
  document.querySelector(".shimmer-container").style.display = "block";
};

const shimmerHide = () => {
  document.querySelector(".shimmer-container").style.display = "none";
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    shimmerShow();
    let favorite = getFavoriteCoins();
    if (favorite.length > 0) {
      const favoriteCoins = await fetchFavoriteCoins(favorite);
      displayFavoriteCoins(favoriteCoins);
    } else {
      const noFavMsg = document.getElementById("no-favorites");
      noFavMsg.style.display = "block";
    }

    shimmerHide();
  } catch (error) {
    console.log(error);
    shimmerHide();
  }
});
