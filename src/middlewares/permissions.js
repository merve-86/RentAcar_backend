"use strict";
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// Middleware: permissions

module.exports = {
  isLogin: (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("NoPermission: You must login.");
    }
  },

  isAdmin: (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("NoPermission: You must login and to be Admin.");
    }
  },

  isStaffOrisAdmin: (req, res, next) => {
    if (req.user && (req.user.isStaff || req.user.isAdmin)) {
      next();
    } else {
      res.errorStatusCode = 403;
      throw new Error("NoPermission: You must be staff or an Admin.");
    }
  },
  
};
