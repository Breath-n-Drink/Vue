const baseUrl = "http://localhost:33118/api";

Vue.createApp({
  data() {
    return {
      drinks: [1],
      nyMåling: 0,
      målingMessage: "",
    };
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
  },
}).mount("#app");
