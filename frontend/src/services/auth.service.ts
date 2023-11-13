import api from "@/utils/api.ts";

export const login = async (user: { email: string; password: string }) => {
  return api.post("login", { json: user }).json();
};

export const register = async (user: {
  firstname: string;
  lastname: string;
  email: string;
  plainPassword: string;
}) => {
  return api.post("users", { json: user }).json();
};
