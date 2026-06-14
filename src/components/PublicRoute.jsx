import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const user = useSelector((store) => store.user);

  if (user) {
    return (
      <Navigate
        to="/home/meetings"
        replace
      />
    );
  }

  return children;
};

export default PublicRoute;