export const isAdmin = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak: Bukan admin" });
  }
  next();
};

export const isUser = (req, res, next) => {
  if (req.role !== "user") {
    return res.status(403).json({ message: "Akses ditolak: Bukan user" });
  }
  next();
};
