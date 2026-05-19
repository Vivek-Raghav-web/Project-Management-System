import jwt from "jsonwebtoken";

// ✅ Token verify karo
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing ❌" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // { id, role, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid ya expired ❌" });
  }
};

// ✅ Role check karo
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Required: ${roles.join("/")} ❌` });
    }
    next();
  };
};
