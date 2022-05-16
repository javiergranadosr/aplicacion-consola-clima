const {
  inquireMenu,
  pause,
  readInput,
  listPlaces,
} = require("./helpers/inquirer");
const Search = require("./models/search");
require("dotenv").config();
const colors = require("colors");

const main = async () => {
  let option;
  const search = new Search();

  do {
    option = await inquireMenu();

    switch (option) {
      case 1:
        // Mostrar mensaje
        const place = await readInput("Ciudad: ");
        const places = await search.searchCity(place);
        const id = await listPlaces(places);
        if (id === "0") continue;
        const placeSelected = places.find((place) => place.id === id);

        search.addRecord(placeSelected.name);

        const weather = await search.searchWeather(placeSelected.lat, placeSelected.lng); // Buscar los lugares
    
        console.log("\nInformacion de la ciudad\n".green);
        console.log("Ciudad: ", placeSelected.name.green);
        console.log("Lat: ", placeSelected.lat);
        console.log("Lng: ", placeSelected.lng);
        console.log("Temperatura: ", weather.temp);
        console.log("Minima: ", weather.min);
        console.log("Maxima: ", weather.max);
        console.log("Como esta el clima: ", weather.desc.green);
        break;
      case 2:
        console.log("\n");
        search.getRecord.forEach( (place, index) => {
          let option = `${colors.green(index + 1)}`
          console.log(`${option}. ${colors.white(place)}`);
        });
        break;
    }

    if (option !== 0) await pause();
  } while (option !== 0);
};

main();
