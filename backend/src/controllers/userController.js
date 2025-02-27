import User from "../models/User";

// Asignar rol de admin a un usuario
export const assignAdminRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { role: "admin" },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" }); // Pendiente de cambiar
    }
    res.status(200).json({ message: "Rol de admin asignado", user }); // Pendiente de cambiar
  } catch (error) {
    res.status(500).json({ message: "Error al asignar rol de admin", error }); // Pendiente de cambiar
  }
};
