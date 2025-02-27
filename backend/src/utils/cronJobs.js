import cron from "node-cron";
import Group from "../models/Group.js";

// Iniciar tareas programadas
export const startCronJobs = () => {
  // Ejecutar todos los días a las 3 AM
  cron.schedule("0 3 * * *", async () => {
    console.log("Ejecutando limpieza de invitaciones expiradas...");
    try {
      const currentDate = new Date();
      const result = await Group.updateMany(
        {},
        { $pull: { invitations: { expiresAt: { $lt: currentDate } } } }
      );
      console.log(
        `Invitaciones expiradas eliminadas de ${result.modifiedCount} grupos`
      );
    } catch (error) {
      console.error("Error al limpiar invitaciones:", error);
    }
  });
};
