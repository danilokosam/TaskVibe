import { withAuthenticationRequired } from "@auth0/auth0-react";
import { PageLoader } from "@/components/page-loader";

export const AuthenticationGuard = ({ component }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <PageLoader />,
  });

  return <Component />;
};
