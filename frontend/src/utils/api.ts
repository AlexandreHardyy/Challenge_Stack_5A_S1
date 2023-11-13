import ky from "ky";

const api = ky.create({ prefixUrl: "http://localhost:8888/api" });

export default api;
