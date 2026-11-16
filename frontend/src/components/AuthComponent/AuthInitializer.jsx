import { refreshAccessToken } from "@/Api/axios/axiosConfig";
import LoadingScreen from "@/pages/LoadingScreen";
import { clearCredentials } from "@/redux/slices/user";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        await refreshAccessToken();
      } catch {
        dispatch(clearCredentials());
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, [dispatch]);

  if (loading) {
    return <LoadingScreen />;
  }

  return children;
}

export default AuthInitializer;