import { useAuth0 } from "@auth0/auth0-react";

export const UserRoles = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) return null; // No mostramos nada si no está autenticado

  const roles = user?.[`${import.meta.env.VITE_AUDIENCE}roles`] || [];

  return (
    <div className="flex gap-2">
      {roles.length > 0 ? (
        roles.map((role) => (
          <div key={role} className="badge badge-outline badge-secondary select-none">
            {role}
          </div>
        ))
      ) : (
        <span className="badge badge-info select-none">No roles</span>
      )}
    </div>
  );
};
