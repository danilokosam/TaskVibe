import * as groupService from '../services/groupService.js';

// Crear un nuevo grupo
export const createGroup = async (req, res) => {
  const { name, ownerId } = req.body;

  try {
    const group = await groupService.createGroup(name, ownerId);
    res.status(201).json(group);
  } catch (error) {
    res.status(error.message === "Owner not found" ? 404 : 500)
      .json({ message: error.message || "Error creating group", error });
  }
};

// Añadir un miembro a un grupo
export const addMemberToGroup = async (req, res) => {
  const { groupId, userId, role } = req.body;

  try {
    const group = await groupService.addMemberToGroup(groupId, userId, role);
    res.status(200).json(group);
  } catch (error) {
    const errorMessages = {
      "Group not found": 404,
      "User not found": 404,
      "Group already has 5 members": 400,
      "User is already a member of the group": 400
    };
    
    const statusCode = errorMessages[error.message] || 500;
    res.status(statusCode).json({ 
      message: error.message || "Error adding member to group", 
      error 
    });
  }
};

// Generar una invitación para un grupo
export const createGroupInvitation = async (req, res) => {
  const { groupId } = req.params;
  const { expiresIn = '7d' } = req.body;
  
  try {
    const baseUrl = process.env.BASEURL;
    const invitation = await groupService.createGroupInvitation(
      groupId, 
      req.user.sub, 
      expiresIn,
      baseUrl
    );
    
    res.status(200).json(invitation);
  } catch (error) {
    const statusCode = error.message === "Group not found" ? 404 : 
                       error.message === "Only admins can create invitations" ? 403 : 500;
    
    res.status(statusCode).json({ 
      message: error.message || "Error creating invitation", 
      error 
    });
  }
};

// Procesar unirse a un grupo mediante código de invitación
export const joinGroupByInvitation = async (req, res) => {
  const { inviteCode } = req.params;
  
  try {
    const result = await groupService.joinGroupByInvitation(inviteCode, req.user.sub);
    res.status(200).json(result);
  } catch (error) {
    const errorMessages = {
      "Invalid or expired invitation": 404,
      "You're already a member of this group": 400,
      "Group has reached maximum capacity": 400
    };
    
    const statusCode = errorMessages[error.message] || 500;
    res.status(statusCode).json({ 
      message: error.message || "Error joining group", 
      error 
    });
  }
};