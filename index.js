const baseUrl = "http://localhost:33118/api"

Vue.createApp({
    data() {
        return {
            nyMåling: 0,
            målingMessage: ""
        }
    },
    methods: {
        getMåling() {
            const url = baseUrl + "/Promille"
            try {
                const response = axios.get(url)
                this.målingMessage = "din måling er " +  response.data
            } catch (ex) {
                alert(ex.message)
            }
        }
    }
}).mount("#app")