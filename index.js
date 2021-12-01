const baseUrl = "https://breathndrinkapi.azurewebsites.net/api";

Vue.createApp({
  data() {
    return {
      drinks: [],
      nyMåling: 0,
      målingMessage: "",
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
    };
  },
  methods: {
    async getMåling() {
      const url = baseUrl + "/promille";
      var x = document.getElementById("hiddenStuff");
      x.style.display = "block";
      try {
        const response = await axios.get(url);
        var n = await response.data;
        this.nyMåling = n.toFixed(1);
      } catch (ex) {
        alert(ex.message);
      }
    },
    async getDrinks() {
      const url = baseUrl + "/drinks";
      try {
        const response = await axios.get(url);
        this.drinks = await response.data;
      } catch (ex) {
        alert(ex.message);
      }
    },
    adjustModal(drink) {
      this.modalDrink = drink;
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

      const url = baseUrl + "/drinks?" + query;

      try {
        const response = await axios.get(url);
        this.drinks = await response.data;
      } catch (ex) {
        /*alert(ex.message)*/
      }

      this.filterMessage = "Ingen drinks med disse filtre"
    },
  },
}).mount("#app");
