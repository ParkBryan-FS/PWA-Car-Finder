// Imports your SCSS stylesheet
import "./styles/index.scss";
import carData from "./car-dataset.json";

(() => {
  let allCars = carData;

  const yearSelect = document.getElementById("yearSelect");
  const makeSelect = document.getElementById("makeSelect");
  const modelSelect = document.getElementById("modelSelect");

  const normalize = (value) => {
    if (!value || typeof value !== "string") return "";
    const lower = value.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const getUniqueSorted = (arr, key) => {
    const cleaned = arr.map((item) => {
      const val = item[key];
      return typeof val === "string" ? normalize(val) : val;
    });
    return [...new Set(cleaned)].sort();
  };

  const populateDropdown = (selectEl, values) => {
    selectEl.length = 1; // keep default option
    values.forEach((val) => {
      const option = document.createElement("option");
      option.value = val;
      option.textContent = val;
      selectEl.appendChild(option);
    });
  };

  const filterCars = () => {
    const year = yearSelect.value;
    const make = makeSelect.value;
    const model = modelSelect.value;

    if (!year || !make || !model) {
      console.clear();
      return;
    }

    const selectedCar = allCars.find(
      (car) =>
        car.year === parseInt(year) &&
        normalize(car.Manufacturer) === make &&
        normalize(car.model) === model
    );

    console.clear();
    if (selectedCar) {
      console.log("Selected car:", selectedCar);
    } else {
      console.log("No car found for selected combination.");
    }
  };

  const updateMakeDropdown = () => {
    const selectedYear = yearSelect.value;
    const yearFiltered = selectedYear
      ? allCars.filter((car) => car.year === parseInt(selectedYear))
      : [];

    const makes = getUniqueSorted(yearFiltered, "Manufacturer");
    populateDropdown(makeSelect, makes);
    makeSelect.disabled = false;

    modelSelect.length = 1;
    modelSelect.disabled = true;

    filterCars();
  };

  const updateModelDropdown = () => {
    const selectedYear = yearSelect.value;
    const selectedMake = makeSelect.value;

    const yearMakeFiltered = allCars.filter(
      (car) =>
        car.year === parseInt(selectedYear) &&
        normalize(car.Manufacturer) === selectedMake
    );

    const models = getUniqueSorted(yearMakeFiltered, "model");
    populateDropdown(modelSelect, models);
    modelSelect.disabled = false;

    filterCars();
  };

  populateDropdown(yearSelect, getUniqueSorted(allCars, "year"));

  makeSelect.disabled = true;
  modelSelect.disabled = true;

  yearSelect.addEventListener("change", updateMakeDropdown);
  makeSelect.addEventListener("change", updateModelDropdown);
  modelSelect.addEventListener("change", filterCars);
})();
