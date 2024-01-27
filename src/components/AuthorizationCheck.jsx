import { Outlet, Navigate } from "react-router";
import { useAtom } from "jotai";
import { userAccessLevelAtom } from "../globalAtom";
import PropTypes from "prop-types";

function ProtectedRoute(props) {
  const [userAccessLevel] = useAtom(userAccessLevelAtom);
  if (props.accessLevel && props.accessLevel === userAccessLevel.toString()) {
    return <Outlet />;
  } else {
    return <Navigate to="/unauthorize" />;
  }
}

ProtectedRoute.propTypes = {
  accessLevel: PropTypes.string,
};

export default ProtectedRoute;
