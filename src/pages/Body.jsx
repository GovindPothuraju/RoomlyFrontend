import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import PageShimmer from "../components/PageShimmer";
import { addUser, removeUser } from "../store/userSlice";
import Sidebar from "../components/Sidebar";

const Body = () => {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);

  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      if (user) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "https://roomlybackend.onrender.com/api/v1/user/profile",
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(response.data.user));
    } catch { 
      dispatch(removeUser());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // run async function inside effect to avoid lint complaining about sync setState
    (async () => {
      await fetchProfile();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  if (loading) {
    return <PageShimmer />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main
        className="
        flex-1
        overflow-y-auto

        pt-20
        lg:pt-0
      "
      >
        <Outlet />
      </main>
    </div>
  );
};


export default Body;