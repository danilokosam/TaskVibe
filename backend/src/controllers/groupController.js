import Group from "../models/Group";
import User from "../models/User";
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import ms from 'ms';

// Crear un nuevo grupo
export const createGroup = async (req, res) => {
  const { name, ownerId } = req.body;

  try {
    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
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

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: "Error creating group", error });
  }
};

// Añadir un miembro a un grupo
export const addMemberToGroup = async (req, res) => {
  const { groupId, userId, role } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verificar si ya existen 5 miembros en el grupo
    if (group.members.length >= 5) {
      return res.status(400).json({ message: "Group already has 5 members" });
    }

    // Verificar si el usuario ya es miembro del grupo
    const isMember = group.members.some(
      (member) => member.user.toString() === userId
    );
    if (isMember) {
      return res
        .status(400)
        .json({ message: "User is already a member of the group" });
    }

    // Añadir el usuario al grupo
    group.members.push({ user: userId, role: role || "member" });
    await group.save();

    // Añadir el grupo al usuario
    user.groups.push(groupId);
    await user.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Error adding member to group", error });
  }
};

// Generar una invitación para un grupo
export const createGroupInvitation = async (req, res) => {
  const { groupId } = req.params;
  const { expiresIn = '7d' } = req.body; // Expira en 7 días por defecto
  
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    
    // Verificar si el usuario solicitante es el propietario o administrador
    const isAdmin = group.members.some(
      member => member.user.toString() === req.user.sub && 
                (member.role === 'admin' || member.role === 'owner')
    );
    
    if (!isAdmin) {
      return res.status(403).json({ message: "Only admins can create invitations" });
    }
    
    // Limitar número de invitaciones activas
    if (group.invitations && group.invitations.length >= 20) {
      // Limpiar invitaciones expiradas
      group.invitations = group.invitations
        .filter(inv => inv.expiresAt > new Date())
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 19);
    }
    
    // Generar un código único
    const inviteCode = nanoid(8); // código de 8 caracteres
    
    // Crear una nueva invitación
    const invitation = {
      code: inviteCode,
      expiresAt: new Date(Date.now() + ms(expiresIn)), // Calcular fecha de expiración
      createdBy: req.user.sub,
      createdAt: new Date()
    };
    
    // Guardar la invitación en el grupo
    group.invitations = group.invitations || [];
    group.invitations.push(invitation);
    await group.save();
    
    // Generar URL de invitación
    const inviteUrl = `${process.env.BASEURL}/join-group/${inviteCode}`; // Pendiente de revisión
    
    // Generar código QR (opcional)
    const qrCodeDataUrl = await QRCode.toDataURL(inviteUrl);
    
    res.status(200).json({
      inviteCode,
      inviteUrl,
      qrCodeDataUrl,
      expiresAt: invitation.expiresAt
    });
    
  } catch (error) {
    res.status(500).json({ message: "Error creating invitation", error });
  }
};

// Procesar unirse a un grupo mediante código de invitación
export const joinGroupByInvitation = async (req, res) => {
  const { inviteCode } = req.params;
  
  try {
    // Buscar el grupo con este código de invitación
    const group = await Group.findOne({
      'invitations.code': inviteCode,
      'invitations.expiresAt': { $gt: new Date() } // Solo invitaciones no expiradas
    });
    
    if (!group) {
      return res.status(404).json({ message: "Invalid or expired invitation" });
    }
    
    const userId = req.user.sub;
    
    // Verificar si el usuario ya es miembro
    const isMember = group.members.some(
      member => member.user.toString() === userId
    );
    
    if (isMember) {
      return res.status(400).json({ message: "You're already a member of this group" });
    }
    
    // Verificar límite de miembros
    if (group.members.length >= 5) {
      return res.status(400).json({ message: "Group has reached maximum capacity" });
    }
    
    // Añadir usuario al grupo
    group.members.push({ user: userId, role: "member" });
    await group.save();
    
    // Añadir grupo al usuario
    const user = await User.findById(userId);
    user.groups.push(group._id);
    await user.save();
    
    res.status(200).json({ 
      message: "Successfully joined group", 
      group: {
        id: group._id,
        name: group.name
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: "Error joining group", error });
  }
};