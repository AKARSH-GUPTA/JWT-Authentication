import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
async function Login(email, password) {
  try {
    const response = await axios.post(`${process.env.BACKEND_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    return error;
  }
}
async function Register(name, email, password) {
  try {
    const response = await axios.post(`${process.env.BACKEND_URL}/register`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    return error;
  }
}

async function getProfile(token) {
  try {
    const response = await axios.get(
      `${process.env.BACKEND_URL}/profilefetcher`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    return error;
  }
}

async function getRefreshToken(acesstoken) {
  try {
    const response = await axios.get(`${process.env.BACKEND_URL}/getToken`, {
      headers: {
        Authorization: `Bearer ${acesstoken}`,
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
}

export { Login, Register, getProfile, getRefreshToken };
