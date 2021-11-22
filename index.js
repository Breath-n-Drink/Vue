const baseUrl = ""

Vue.createApp({
    data() {
        return {
            måling: 0,
            målingMessage: ""
        }
    },
    methods: {
        måling() {
            const url = baseUrl
            try {
                const response = axios.get(url)
                this.målingMessage = "din måling er " +  response.data
            } catch (ex) {
                alert(ex.message)
            }
        }
    }
}).mount("#app")