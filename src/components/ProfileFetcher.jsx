import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getRefreshToken } from "./authentication.js";
import LoadingScreen from "./Loading.jsx";
function ProfileFetcher() {
  const { acesstoken } = useParams();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function Fetcher() {
      try {
        const response = await getRefreshToken(acesstoken);

        localStorage.setItem("token", response.token);

        setReady(true);
      } catch (err) {
        console.log(err);
      }
    }

    Fetcher();
  }, [acesstoken]);

  if (!ready) return <LoadingScreen />;

  return <Navigate to="/" replace />;
}

export default ProfileFetcher;
