const APP = {
  imageContainer: document.getElementById("images"),
  search: document.getElementById("search"),
  searchForm: document.getElementById("searchForm"),
  url: "https://api.pexels.com/v1/",
  options: {
    headers: {
      Authorization: "YOUR_API_KEY_HERE",
    },
  },

  init: function () {
    APP.searchForm.addEventListener("submit", (ev) => {
      ev.preventDefault();

      APP.fetchData();

      APP.imageContainer.innerHTML = "";
    });
  },

  fetchData: function () {
    const apiUrl = `${
      APP.url
    }search?query=${APP.search.value.trim()}&per_page=1&page=1`;

    if (APP.search.value === "") {
      APP.errorHandler("field must not be empty");
      return;
    }

    fetch(apiUrl, APP.options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network Error Occurred");
        }

        return response.json();
      })
      .then((data) => {
        console.log(data);

        let imageList = new DocumentFragment();

        data.photos.forEach((imageUrl) => {
          fetch(imageUrl.src.original)
            .then((response) => {
              if (!response.ok) {
                throw new Error("error");
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
            })
            .catch((err) => {
              APP.errorHandler(err);
            });
        });
      })
      .catch((error) => {
        APP.errorHandler(error);
      });
  },

  errorHandler: function (err) {
    APP.imageContainer.innerHTML = `<h3>${err}</h3>`;
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
