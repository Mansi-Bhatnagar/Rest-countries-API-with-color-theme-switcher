"use strict";
const switchTheme = document.querySelector(".mode");
const loader = document.querySelector(".loader");
const errormsg = document.querySelector(".error-msg");
const searchInput = document.querySelector(".search input");
const dropdownItems = document.querySelectorAll(".dropdown-item");
const container1 = document.querySelector(".wrapp");
const container2 = document.querySelector(".wrapp2");
const fetchALl = async function () {
  displayLoader();
  try {
    const res = await fetch("https://restcountries.com/v3.1/all");
    const data = await res.json();
    hideLoader();
    createCard(data);
  } catch (err) {
    console.log(err);
  }
};
window.addEventListener("load", fetchALl);
const container = document.querySelector(".country_container");
const createCard = function (countries) {
  try {
    hideError();
    container.innerHTML = "";
    countries.forEach((country) => {
      const cardMarkup = `<a href='#${
        country.name.common
      }' class="mt-5  ms-4 me-4">
        <div class="card" style='width: 15rem'>
          <img class="flag" src="${country.flags.svg}">
          <div class="info card-body">
            <h5 class='card-title'>${country.name.common}</h5>
            <p>
              <span class="card-headings">Population:</span>
              <span class="card-info">${country.population}</span>
            </p>
            <p>
              <span class="card-headings">Region:</span>
              <span class="card-info">${country.region}</span>
            </p>
            <p>
              <span class="card-headings">Capital:</span>
              <span class="card-info">${country.capital?.join(", ")}</span>
            </p>
          </div>
        </div>
      </a>`;
      container.insertAdjacentHTML("beforeend", cardMarkup);
    });
  } catch (e) {
    console.log(e);
  }
};
switchTheme.addEventListener("click", function () {
  const body = document.querySelector("body");
  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    body.classList.add("light");
  } else {
    body.classList.remove("light");
    body.classList.add("dark");
  }
});
const searchCountry = async function (e) {
  displayLoader();
  try {
    const query = e.target.value;
    if (query.trim() === "") {
      fetchALl();
      return;
    }
    const req = await fetch(`https://restcountries.com/v3.1/name/${query}`);
    if (!req.ok) {
      displayError();
      throw new Error("No countries found!");
    } else {
      const data = await req.json();
      hideLoader();
      createCard(data);
    }
  } catch (err) {
    console.log(err.message);
  }
};
const searchByFullName = async function (e) {
  if (e.key === "Enter") {
    const query = e.target.value;
    if (query.trim() !== "") {
      displayLoader();
      const req = await fetch(
        `https://restcountries.com/v3.1/name/${query}?fullText=true`
      );
      if (!req.ok) {
        displayError();
      } else {
        const data = await req.json();
        hideLoader();
        createCard(data);
      }
    }
  }
};
searchInput.addEventListener("input", searchCountry);
searchInput.addEventListener("keydown", searchByFullName);
const filter = async function (e) {
  displayLoader();
  try {
    const continent = e.target.textContent;
    if (continent === "All") {
      fetchALl();
      return;
    } else {
      const req = await fetch(
        `https://restcountries.com/v3.1/region/${continent}`
      );
      const data = await req.json();
      hideLoader();
      createCard(data);
    }
  } catch (err) {
    console.log(err);
  }
};
const displayDetailed = function (data) {
  try {
    container1.style.display = "none";
    container2.innerHTML = "";
    let currStr = [];
    displayLoader();
    for (let key in data[0].currencies) {
      currStr.push(data[0].currencies[key].name);
    }
    currStr = currStr.join(", ");
    const html = `
    <a href="#"><button class="btn back d-flex align-items-center justify-content-center mt-5">
    <img src="images/arrow-left-long-solid.svg" class="me-2 ms-3" />
    <span class="me-3">Back</span>
  </button></a>
    
<div class="d-flex justify-content-start second mt-5">
  <div>
    <img src=${data[0].flags.png} class="flag-image" />
  </div>
  <div class="info">
    <h2 class="country-name ">${data[0].name.common}</h2>
    <div class="detail-wrapper d-flex align-items-start justify-content-between flex-wrap">
      <div class="col1">
        <p class="d-flex align-items-start justify-content-start pt-2">
          <span class="info-headings">Native Name: </span>
          <span class="info-values">${
            Object.values(data[0].name.nativeName)[0].official
          }</span>
        </p>
        <p class="d-flex align-items-start justify-content-start pt-2">
          <span class="info-headings">Population: </span
          ><span class="info-values">${data[0].population}</span>
        </p>
        <p class="d-flex align-items-start justify-content-start pt-2">
          <span class="info-headings">Region: </span
          ><span class="info-values">${data[0].region}</span>
        </p>
        <p class="d-flex align-items-start justify-content-start pt-2">
          <span class="info-headings">Sub Region: </span
          ><span class="info-values">${data[0].subregion}</span>
        </p>
        <p class="d-flex align-items-start justify-content-start pt-2">
          <span class="info-headings">Capital: </span
          ><span class="info-values">${data[0].capital[0]}</span>
        </p>
      </div>
      <div class="col2">
        <p class="d-flex align-items-start justify-content-start pt-2">
          <span class="info-headings">Top Level Domain: </span
          ><span class="info-values">${data[0].tld[0]}</span>
        </p>
        <p class="d-flex align-items-start justify-content-start pt-2">
          <span class="info-headings currency">Currencies: </span
          ><span class="info-values">${currStr}</span>
        </p>
        <p class="d-flex align-items-start justify-content-start pt-2">
          <span class="info-headings language">Languages: </span
          ><span class="info-values">${Object.values(data[0].languages).join(
            ", "
          )}</span>
        </p>
      </div>
    </div>
    <div class="borders mt-5 mb-5">
    </div>
  </div>
</div>
    `;
    hideLoader();
    container2.insertAdjacentHTML("beforeend", html);
  } catch (err) {
    console.log(err);
  }
};
dropdownItems.forEach((item) => item.addEventListener("click", filter));
const getCountryFromBorder = function (borders) {
  try {
    const borderDiv = document.querySelector(".borders");
    const htmlmarkup = `<span class="info-headings">Border Countries:</span>`;
    borderDiv.insertAdjacentHTML("beforeend", htmlmarkup);
    borders.forEach((border) => {
      fetch(`https://restcountries.com/v3.1/alpha/${border}`)
        .then((res) => res.json())
        .then((data) => {
          const nameMarkup = `<a href="#${data[0].name.common}"><button class="box btn ms-2 me-1 ps-4 pe-4 pt-1 pb-1 mt-2 mb-2">${data[0].name.common}</button></a>`;
          borderDiv.insertAdjacentHTML("beforeend", nameMarkup);
        });
    });
    hideLoader();
  } catch (err) {
    console.log(err);
  }
};
const getDetails = async function (e) {
  try {
    const country = window.location.hash.slice(1);
    if (country.trim() === "") {
      container1.style.display = "block";
      container2.innerHTML = "";
      return;
    }
    displayLoader();
    const req = await fetch(
      `https://restcountries.com/v3.1/name/${country}?fullText=true`
    );
    const data = await req.json();
    displayDetailed(data);
    if (data[0].borders) {
      displayLoader();
      getCountryFromBorder(data[0].borders);
    }
  } catch (err) {
    console.log(err);
  }
};

window.addEventListener("hashchange", getDetails);
function displayLoader() {
  loader.style.display = "block";
}
function hideLoader() {
  loader.style.display = "none";
}
function displayError() {
  errormsg.style.display = "block";
}
function hideError() {
  errormsg.style.display = "none";
}
