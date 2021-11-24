const baseUrl = "http://localhost:33118/api";

Vue.createApp({
  data() {
    return {
      drinks: [],
      nyMåling: 0,
      målingMessage: "",
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
        this.nyMåling = await response.data;
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
    calculatePct(pct) {
      if (pct == -1.0) {
        return "NA"
      } else {
        return Math.round(pct * 100) + " %"
      }
    }
  },
}).mount("#app");
