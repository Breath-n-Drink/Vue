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
      
    }
  },
}).mount("#app");
