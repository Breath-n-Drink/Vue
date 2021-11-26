const baseUrl = "http://localhost:33118/api";

Vue.createApp({
  data() {
    return {
      drinks: [],
      nyMåling: 0,
      målingMessage: "",
      modalDrink: {
        name: "test",
      },
      bodyWeight: 75,
    };
  },
  created() {
    this.getDrinks()
  },
  methods: {
    async getMåling() {
      const url = "http://localhost:33118/api/Promille";
      try {
        const response = await axios.get(url);
        var n = await response.data;
        this.nyMåling = n.toFixed(1);
      } catch (ex) {
        alert(ex.message);
      }
    },
    async getDrinks() {
      const url = baseUrl + "/drinks"
      try {
        const response = await axios.get(url);
        this.drinks = await response.data;
      } catch (ex) {
        alert(ex.message)
      }
    },
    adjustModal(drink) {
      this.modalDrink = drink
    },  
    async getDrinksByPromille(weight, currentBac, maxBac) {
      const url = baseUrl + "/drinks?bodyWeight=" + weight + "&bloodAlcCon=" + currentBac + "&maxBacRequest=" + maxBac + "&gender=" + 0
      try {
        const response = await axios.get(url);
        this.drinks= await response.data;
      } catch (ex) {
        alert(ex.message)
      }
      
    },
    calculatePct(pct) {
      if (pct == -1.0) {
        return "NA"
      } else {
        return Math.round(pct * 100) + " %"
      }
    },
    calculateVol(vol) {
      if (vol == -1.0) {
        return "NA"
      } else {
        return Math.round(vol) + " mL"
      }
    },
    projectedPromille(vol, pct, bWeight) {
      if (vol == -1.0) {
        return "NA"
      }
      if (pct == -1.0) {
        return "NA"
      }
      return ((Math.round(((vol*pct*0.78945)/(0.68*bWeight)+Number.EPSILON)*100))/100)
    }
  },
}).mount("#app");
