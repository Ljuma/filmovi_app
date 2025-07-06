import { useNavigate, useParams, useLocation } from "react-router-dom";

const routerHelper = (Component) => {
  const Wrapper = (props) => {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();

    return (
      <Component
        navigate={navigate}
        params={params}
        location={location}
        {...props}
      />
    );
  };

  return Wrapper;
};

export default routerHelper;
