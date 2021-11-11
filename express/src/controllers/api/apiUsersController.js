// para trabajar con la DB
const db = require("../../database/models");

const Op = db.Sequelize.Op;

const apiUsersController = {
  // listar todos users
  list: async (req, res) => {
    try {
      // USERS PAGINATION
      const pageAsNumber = parseInt(req.query.page);
      const limit = 5;

      // definimos la paginación
      let page = 1;
      if (!Number.isNaN(pageAsNumber) && pageAsNumber > 1) {
        page = pageAsNumber;
      }

      // TODOS LOS USERS
      const users = await db.User.findAll({
        attributes: ["id", "firstName", "lastName", "email"],
        order: [["id", "ASC"]],
      });

      // MUESTRA DE USERS CON OFFSET-LIMIT
      const paginatedUsers = await db.User.findAll({
        limit: limit,
        offset: (page - 1) * limit,
        attributes: ["id", "firstName", "lastName", "email"],
        order: [["id", "ASC"]],
      });

      users.forEach((user) => {
        return (user.dataValues.detail = `http://localhost:3000/api/users/${user.id}`);
      });

      // otra forma de hacerlo
      // users.forEach((user) => {
      //   return user.setDataValue(
      //     "detail",
      //     `http://localhost:3000/api/users/${user.id}`
      //   );
      // });
      const totalPages = Math.ceil(users.length / limit);

      res.status(200).json({
        meta: {
          count: users.length,
          totalPages,
          currentPage: page,
          next:
            page < totalPages && page > 0
              ? `http://localhost:3000/api/users/?page=${page + 1}`
              : undefined,
          previous:
            page > 1 && page <= totalPages
              ? `http://localhost:3000/api/users/?page=${page - 1}`
              : undefined,
        },
        users: paginatedUsers,
      });
    } catch (e) {
      res.status(500).json({
        meta: {
          status: "error",
        },
        error: "Users not found",
      });
    }
  },

  // detalle de un user
  detail: async (req, res) => {
    const id = req.params.id;
    try {
      const user = await db.User.findOne({
        include: ["image"],
        attributes: { exclude: ["password", "role_id", "image_id"] },
        where: {
          id: id,
        },
      });

      // sobreescribimos el valor de image en la muestra al cliente
      user.dataValues.image = `/images/users/${user.image.name}`;
      // user.setDataValue("image", `/images/users/${user.image.name}`);

      // le mandamos el user con la info
      res.status(200).json({
        user,
      });
    } catch (e) {
      res.status(500).json({
        meta: {
          status: "error",
        },
        error: "User not found",
      });
    }
  },
};

module.exports = apiUsersController;