import { useParams } from "react-router-dom";

export function routerHelperID(Component) {
  return (props) => {
    const params = useParams();
    return <Component {...props} params={params} />;
  };
}
