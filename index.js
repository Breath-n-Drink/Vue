const baseUrl = ""

Vue.createApp({
    data() {
        return {
            måling: 0,
            målingMessage: ""
        }
    },
    methods: {
        async måling() {
            const url = baseUrl
            try {
                const response = await axios.get(url)
                this.målingMessage = await "din måling er " +  response.data
            } catch (ex) {
                alert(ex.message)
            }
        }
    }
}).mount("#app")