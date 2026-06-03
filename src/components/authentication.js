import axios from "axios";

async function Login(email, password) {
  try {
    const response = await axios.post("http://localhost:4000/login", {
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
    const response = await axios.post("http://localhost:4000/register", {
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
    const response = await axios.get("http://localhost:4000/profilefetcher", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
}

async function getRefreshToken(acesstoken) {
  try {
    const response = await axios.get("http://localhost:4000/getToken", {
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
