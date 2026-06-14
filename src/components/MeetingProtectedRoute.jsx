import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MeetingProtectedRoute = ({
  children,
}) => {

  const user = useSelector(
    (store) => store.user
  );

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
};

export default MeetingProtectedRoute;