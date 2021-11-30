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
    };
  },
  methods: {
    async getMåling() {
      const url = baseUrl + "/promille"
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
    async getDrinksByPromille(weight, currentBac, maxBac, gender = 0) {
      
      const url = baseUrl + "/drinks?bodyWeight=" + weight + "&bloodAlcCon=" + currentBac + "&maxBacRequest=" + maxBac + "&gender=" + gender
      try {
        const response = await axios.get(url);
        this.drinks= await response.data;
      } catch (ex) {
        /*alert(ex.message)*/
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
    projectedPromille(vol, pct, bWeight, gender = 0) {
      if (vol == -1.0) {
        return "NA"
      }
      if (pct == -1.0) {
        return "NA"
      }
      
      var ratio
      if (gender == 0) {
        ratio = 0.6
      } else if (gender == 1) {
        ratio = 0.68
      } else if (gender == 2) {
        ratio = 0.55
      }

      return ((Math.round(((vol*pct*0.78945)/(ratio*bWeight)+Number.EPSILON)*100))/100)
    },
    filter(filterobject) {
      var Removed = false
      if(this.filterArray.includes(filterobject)) {
          this.filterArray = this.filterArray.filter(item => item !== filterobject)
          Removed = true
      } else {
        this.filterArray.push(filterobject)
      }
      if(this.filterArray.length > 0) {
        if(Removed == true) {this.getDrinks()}
        
        this.filterArray.forEach(element => {

          setTimeout(() => this.drinks = this.drinks.filter(item => item.ingredientList.includes(element)), 500) 
      });
     } else {
       this.getDrinks()
     }
    }
  },
}).mount("#app");
