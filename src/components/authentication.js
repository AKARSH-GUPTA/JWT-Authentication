import axios from "axios";

async function Login(email, password) {
  const response = await axios.post("http://localhost:4000/login", {
    email,
    password,
  });
  return response.data;
}
async function Register(name, email, password) {
  const response = await axios.post("http://localhost:4000/register", {
    name,
    email,
    password,
  });
  return response.data;
}

export { Login, Register };
