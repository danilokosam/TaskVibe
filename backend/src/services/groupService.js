import Group from "../models/Group.js";
import User from "../models/User.js";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import ms from "ms";

// Crear un nuevo grupo
export const createGroup = async (name, ownerId) => {
  const owner = await User.findById(ownerId);
  if (!owner) {
    throw new Error("Owner not found");
  }

  const group = new Group({
    name,
    owner: owner._id,
    members: [{ user: owner._id, role: "admin" }],
  });

  await group.save();

  // Añadir el grupo al usuario
  owner.groups.push(group._id);
  await owner.save();

  return group;
};

// Añadir un miembro a un grupo
export const addMemberToGroup = async (groupId, userId, role) => {
  const group = await Group.findById(groupId);
  if (!group) {
    throw new Error("Group not found");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Verificar si ya existen 5 miembros en el grupo
  if (group.members.length >= 5) {
    throw new Error("Group already has 5 members");
  }

  // Verificar si el usuario ya es miembro del grupo
  const isMember = group.members.some(
    (member) => member.user.toString() === userId
  );
  if (isMember) {
    throw new Error("User is already a member of the group");
  }

  // Añadir el usuario al grupo
  group.members.push({ user: userId, role: role || "member" });
  await group.save();

  // Añadir el grupo al usuario
  user.groups.push(groupId);
  await user.save();

  return group;
};

// Generar una invitación para un grupo
export const createGroupInvitation = async (
  groupId,
  userId,
  expiresIn = "7d",
  baseUrl
) => {
  const group = await Group.findById(groupId);
  if (!group) {
    throw new Error("Group not found");
  }

  // Verificar si el usuario solicitante es el propietario o administrador
  const isAdmin = group.members.some(
    (member) =>
      member.user.toString() === userId &&
      (member.role === "admin" || member.role === "owner")
  );

  if (!isAdmin) {
    throw new Error("Only admins can create invitations");
  }

  // Limitar número de invitaciones activas
  if (group.invitations && group.invitations.length >= 20) {
    // Limpiar invitaciones expiradas
    group.invitations = group.invitations
      .filter((inv) => inv.expiresAt > new Date())
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 19);
  }

  // Generar un código único
  const inviteCode = nanoid(8); // código de 8 caracteres

  // Crear una nueva invitación
  const invitation = {
    code: inviteCode,
    expiresAt: new Date(Date.now() + ms(expiresIn)), // Calcular fecha de expiración
    createdBy: userId,
    createdAt: new Date(),
  };

  // Guardar la invitación en el grupo
  group.invitations = group.invitations || [];
  group.invitations.push(invitation);
  await group.save();

  // Generar URL de invitación
  const inviteUrl = `${baseUrl}/join-group/${inviteCode}`;

  // Generar código QR
  const qrCodeDataUrl = await QRCode.toDataURL(inviteUrl);

  return {
    inviteCode,
    inviteUrl,
    qrCodeDataUrl,
    expiresAt: invitation.expiresAt,
  };
};

// Procesar unirse a un grupo mediante código de invitación
export const joinGroupByInvitation = async (inviteCode, userId) => {
  // Buscar el grupo con este código de invitación
  const group = await Group.findOne({
    "invitations.code": inviteCode,
    "invitations.expiresAt": { $gt: new Date() }, // Solo invitaciones no expiradas
  });

  if (!group) {
    throw new Error("Invalid or expired invitation");
  }

  // Verificar si el usuario ya es miembro
  const isMember = group.members.some(
    (member) => member.user.toString() === userId
  );

  if (isMember) {
    throw new Error("You're already a member of this group");
  }

  // Verificar límite de miembros
  if (group.members.length >= 5) {
    throw new Error("Group has reached maximum capacity");
  }

  // Añadir usuario al grupo
  group.members.push({ user: userId, role: "member" });
  await group.save();

  // Añadir grupo al usuario
  const user = await User.findById(userId);
  user.groups.push(group._id);
  await user.save();

  return {
    message: "Successfully joined group",
    group: {
      id: group._id,
      name: group.name,
    },
  };
};
