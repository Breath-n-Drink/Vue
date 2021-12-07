const baseUrl = "https://breathndrinkapi.azurewebsites.net/api";

Vue.createApp({
  data() {
    return {
      drinks: [],
      modalDrink: {
        name: "test",
      },
      filterArray: [],
      notFilterArray: [],
      filterableItems: ["Vodka", "Rum", "Beer", "Champagne", "Cognac", "Gin"],
      notFilterableItems: ["Vodka", "Rum", "Beer", "Champagne", "Cognac", "Gin"],
      filterAlcPer: [0, 100],
      weight: "",
      currentBAC: "",
      maxBAC: "",
      gender: "0",
      filterMessage: "",
      name: "",
      nameFilter: "",
      userId: 0,
      loggedIn: false,
      sortByRating: 0,
      funnyComment: "",
      modalFavorite: false,
      favorites: [],
      promilles: [],
      time: new Date()
    };
  },
  watch: {
    maxBAC: async function () {
      const options = {
        headers: {
          "content-type": "application/vnd.api+json",
          "Accept": "application/vnd.api+json"
        }
      }
      const url = baseUrl + "/drinkers/" + this.userId
      try {
        await axios.put(url, JSON.stringify(this.maxBAC), options);
      } catch (ex) {
        /*alert(ex.message)*/
      }
      // alert(this.maxBAC)
    }
  },
  methods: {
    async getAlcoholLevel() {
      const url = baseUrl + "/promille";
      var x = document.getElementById("hiddenStuff");
      x.style.display = "block";
      try {
        const response = await axios.get(url);
        var n = await response.data;
        this.currentBAC = n.toFixed(1);
      } catch (ex) {
        // alert(ex.message);
      }
      this.funnyCommentMethod()
    },
    async showMeasurementModal() {
      $("#myModalMeasurement").modal({ backdrop: "static" });
      $("#myModalMeasurement").modal('show');
    },
    async getDrinks() {
      const url = baseUrl + "/drinks" + "?sortByRating=" + this.sortByRating;
      try {
        const response = await axios.get(url);
        this.drinks = await response.data;
      } catch (ex) {
        // alert(ex.message);
      }
    },
    async addRating(ratingValue) {
      const url = baseUrl + `/Drinks?id=${this.modalDrink.drinkId}&drinkerId=${this.userId}&rating=${ratingValue}`
      try {
        await axios.post(url)
      } catch (ex) {
        // alert(this.modalDrink.drinkId);
      }
    },
    async adjustModal(drink) {
      this.modalDrink = drink;
      const url = baseUrl + `/Drinks/Favorites?drinkerId=${this.userId}`
      const response = await axios.get(url)
      this.favorites = await response.data;
      console.log(this.favorites)
      this.favorites.forEach(favorite => {
        if (favorite.drinkId == this.modalDrink.drinkId) {
          this.modalFavorite = true
        }
        else {
          this.modalFavorite = false
        }
      })
    },
    async getDrinksByPromille(weight, currentBac, maxBac, gender = 0) {

      const url =
        baseUrl +
        "/drinks?bodyWeight=" +
        weight +
        "&bloodAlcCon=" +
        currentBac +
        "&maxBacRequest=" +
        maxBac +
        "&gender=" +
        gender;
      try {
        const response = await axios.get(url);
        this.drinks = await response.data;
      } catch (ex) {
        /*alert(ex.message)*/
      }
    },
    calculatePct(pct) {
      if (pct == -1.0) {
        return "NA";
      } else {
        return Math.round(pct * 100) + " %";
      }
    },
    calculateVol(vol) {
      if (vol == -1.0) {
        return "NA";
      } else {
        return Math.round(vol) + " mL";
      }
    },
    projectedPromille(vol, pct, bWeight, gender = 0) {
      if (vol == -1.0) {
        return "NA";
      }
      if (pct == -1.0) {
        return "NA";
      }

      var ratio;
      if (gender == 0) {
        ratio = 0.6;
      } else if (gender == 1) {
        ratio = 0.68;
      } else if (gender == 2) {
        ratio = 0.55;
      }

      return ((vol * pct * 0.78945) / (ratio * bWeight)).toFixed(2);
    },
    addFilter(filterobject) {
      if (this.filterArray.includes(filterobject)) {
        this.filterArray = this.filterArray.filter(
          (item) => item !== filterobject
        );
      } else {
        this.filterArray.push(filterobject);
      }
    },

    addNotFilter(filterobject) {
      if (this.notFilterArray.includes(filterobject)) {
        this.notFilterArray = this.notFilterArray.filter(
          (item) => item !== filterobject
        );
      } else {
        this.notFilterArray.push(filterobject);
      }
    },

    async filter() {
      var query = "";

      if (this.nameFilter !== "") {
        query += "name=" + this.nameFilter + "&"
      }

      if (this.filterArray.length > 0) {
        this.filterArray.forEach((element) => {
          query += "ingredients=" + element + "&";
        });
      }

      if (this.notFilterArray.length > 0) {
        this.notFilterArray.forEach((element) => {
          query += "notFilter=" + element + "&";
        });
      }

      query +=
        "minAlcPer=" +
        this.filterAlcPer[0] +
        "&maxAlcPer=" +
        this.filterAlcPer[1];

      if (
        this.weight !== "" &&
        this.currentBAC !== "" &&
        this.maxBAC !== "" &&
        this.gender !== ""
      ) {
        query +=
          "&bodyWeight=" +
          this.weight +
          "&bloodAlcCon=" +
          this.currentBAC +
          "&maxBacRequest=" +
          this.maxBAC +
          "&gender=" +
          this.gender;
      }
      query += "&sortByRating=" + this.sortByRating

      const url = baseUrl + "/drinks?" + query;

      try {
        const response = await axios.get(url);
        this.drinks = await response.data;
      } catch (ex) {
        /*alert(ex.message)*/
      }

      this.filterMessage = "Ingen drinks med disse filtre"

      console.log(url)
      console.log("nameFilter: " + this.nameFilter)
    },
    async getDrinker() {
      this.loggedIn = true;
      const url = baseUrl + "/drinkers/name=" + this.name
      var drinker;
      try {
        const response = await axios.get(url);
        drinker = await response.data
      } catch (ex) {

      }
      this.maxBAC = drinker.maxPromille
      this.userId = drinker.id
    },
    async addDrinker() {
      const url = baseUrl + `/drinkers?name=${this.name}`
      try {
        const response = await axios.post(url)
      } catch (ex) {

      }
    },
    resetFilters() {
      this.filterArray = []
      this.notFilterArray = []
      this.filterAlcPer[0] = 0
      this.filterAlcPer[1] = 100
    },
    getRandomDrink() {
      this.modalDrink = this.drinks[Math.floor(Math.random() * this.drinks.length)]
    },
    funnyCommentMethod() {
      if (this.currentBAC < 0.7) {
        this.funnyComment = "You're fine mate, drink some more"
      }
      else if (this.currentBAC >= 0.7 && this.currentBAC < 1.4) {
        this.funnyComment = "Continue onwards!!!"
      } else if (this.currentBAC >= 1.4 && this.currentBAC < 2.9) {
        this.funnyComment = "It's time to stop (insert man with clock meme here)"
      } else {
        this.funnyComment = "ba-bu, ba-bu, ba-bu, ba-bu"
      }
    },
    async getPromilleHistory() {
      const url = baseUrl + `/Promille/id=` + this.userId
      try {
        const response = await axios.get(url)
        this.promilles = await response.data
        this.time = this.ParseJsonDate(this.promilles[0].time)
        console.log("time in json: " + this.time.format('yyyy-mm-dd-hh-MM-ss'))
      } catch (ex) {
        alert(ex);
      }
    },
    ParseJsonDate(dateString) {
      //var milli = dateString.replace(/\/Date\((-?\d+)\)\//, '$1');
      var date = new Date(dateString);
      return date;
    },
    async addFavorite() {
      const url = baseUrl + `/FavoriteDrinks?drinkId=${this.modalDrink.drinkId}&drinkerId=${this.userId}`
      try {
        const response = await axios.post(url)
      } catch (ex) {

      }
      this.modalFavorite = true
    },
    async removeFavorite() {
      const url = baseUrl + `/FavoriteDrinks?drinkId=${this.modalDrink.drinkId}&drinkerId=${this.userId}`
      try {
        const response = await axios.delete(url)
      } catch (ex) {

      }
      this.modalFavorite = false
    }
  },
}).mount("#app");
