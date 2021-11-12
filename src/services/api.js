import axios from "axios";

// baseURL: https://economia.awesomeapi.com.br/json/

// rota: all/EUR-BRL

const api = axios.create({
  baseURL: "https://economia.awesomeapi.com.br/json/",
});

export default api;
