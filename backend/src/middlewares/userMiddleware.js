import User from "../models/User.js";
export const userMiddleware = async (req, res, next) => {
  try {
    console.log('Entering userMiddleware');
    console.log('User info from JWT:', req.user);

    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please login first',
      });
    }

    // Si es un token de cliente (client credentials)
    if (req.user.gty === 'client-credentials') {
      // Buscar o crear un usuario para el cliente
      const auth0Id = req.user.sub;
      let clientUser = await User.findOne({ auth0Id });

      if (!clientUser) {
        clientUser = await User.create({
          auth0Id,
          email: 'api-client@example.com',
          name: 'API Client',
          role: 'api-client'
        });
      }

      // Asignar el _id de MongoDB del usuario cliente
      req.user = clientUser; // user es el documento de usuario con _id de MongoDB
      req.userId = clientUser._id; // Este es el _id que se usa en las tareas
      return next();
    }

    // Para tokens de usuario normales, continuar con la lógica existente...
    const auth0Id = req.user.sub;
    const email = req.user.email;
    const name = req.user.name || req.user.email;

    if (!auth0Id || !email) {
      return res.status(400).json({
        error: 'Invalid token',
        message: 'Missing required user information (auth0Id or email).',
      });
    }

    let user = await User.findOne({ auth0Id });

    if (!user) {
      try {
        user = await User.create({
          auth0Id,
          email,
          name,
        });
      } catch (error) {
        if (error.code === 11000) {
          return res.status(409).json({
            error: 'User already exists',
            message: 'A user with this email or Auth0 ID already exists.',
          });
        }
        throw error;
      }
    }

    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    console.error('Error in user middleware:', error);
    res.status(500).json({
      error: 'Error processing user authentication',
      details: error.message,
    });
  }
};