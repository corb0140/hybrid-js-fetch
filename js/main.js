const APP = {
  imageContainer: document.getElementById("images"),
  search: document.getElementById("search"),
  searchForm: document.getElementById("searchForm"),
  url: "https://api.pexels.com/v1/",
  options: {
    headers: {
      Authorization: "PLACE_YOUR_API_KEY_HERE",
    },
  },

  init: function () {
    APP.searchForm.addEventListener("submit", (ev) => {
      ev.preventDefault();

      APP.fetchData();
    });
  },

  fetchData: function () {
    const apiUrl = `${
      APP.url
    }search?query=${APP.search.value.trim()}&per_page=5&page=1`;

    if (APP.search.value === "") {
      APP.errorHandler("Search field must not be empty");
      return;
    }

    fetch(apiUrl, APP.options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network Error Occurred ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        console.log(data);
        APP.imageContainer.innerHTML = "";

        let imageList = new DocumentFragment();

        data.photos.forEach((imageUrl) => {
          fetch(imageUrl.src.original)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to fetch image");
              }

              return response.blob();
            })
            .then((blob) => {
              console.log(blob);
              let image = URL.createObjectURL(blob);

              let div = document.createElement("div");
              div.classList.add("image__container");

              div.innerHTML = `
                <img src="${image}" alt='random ${APP.search.value} image generated from pexels api' />
              `;

              imageList.appendChild(div);

              APP.imageContainer.appendChild(imageList);

              APP.search.value = "";
              dialog.style.display = "none";
            })
            .catch((error) => {
              APP.errorHandler(error);
            });
        });
      })
      .catch((error) => {
        console.error("hello");
        APP.errorHandler(error);
      });
  },

  errorHandler: function (err) {
    console.log(err);
    const dialog = document.getElementById("dialog");
    dialog.style.display = "flex";
    dialog.innerHTML = `<h3>${err}</h3>`;
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
