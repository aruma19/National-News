import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Forbidden
    console.log("TOKEN DECODED:", decoded);

    req.role = decoded.role;

    if (decoded.role === "admin") {
      req.adminId = decoded.id;
    } else {
      req.userId = decoded.id;
    }

    req.email = decoded.email; // Optional

    next();
  });
};
