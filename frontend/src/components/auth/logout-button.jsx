import { useAuth0 } from "@auth0/auth0-react";

export const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <button className="btn btn-outline btn-error text-xs px-2 py-1" onClick={handleLogout}>
      Log Out
    </button>
  );
};
