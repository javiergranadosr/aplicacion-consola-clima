const fs = require("fs");
const axios = require("axios");

class Search {
  record = [];
  dbPath = "./db/database.json";

  constructor() {
    this.readDB();
  }

  get getRecord() {
    return this.record.map((place) => {
      return place.replace(/^\w/, (c) => c.toUpperCase());
    });
  }

  get paramsMapbox() {
    return {
      language: "es",
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
    };
  }

  async searchCity(city = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json`,
        params: this.paramsMapbox,
      });

      const data = await instance.get();

      return data.data.features.map((place) => ({
        id: place.id,
        name: place.place_name,
        lng: place.center[0],
        lat: place.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async searchWeather(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: {
          lat,
          lon,
          appid: process.env.OPEN_WEATHER_KEY,
          units: "metric",
          lang: "es",
        },
      });
      const resp = await instance.get();
      const { weather, main } = resp.data;
      return {
        desc: weather[0].description,
        min: main.temp_min,
        max: main.temp_max,
        temp: main.temp,
      };
    } catch (error) {
      console.log(error);
    }
  }

  addRecord(place = "") {
    if (this.record.includes(place.toLowerCase())) {
      return;
    }

    this.record.unshift(place.toLowerCase());
    this.saveDB();
  }

  saveDB() {
    const payload = {
      record: this.record,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDB() {
    if (!fs.existsSync(this.dbPath)) {
      return null;
    }
    const data = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    if (data.length > 0) {
      this.record = JSON.parse(data).record;
    }
  }
}

module.exports = Search;
