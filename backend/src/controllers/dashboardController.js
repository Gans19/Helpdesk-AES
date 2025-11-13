const ticketModel = require('../models/ticketModel');

const getDashboard = async (req, res, next) => {
  try {
    const counts = await ticketModel.countTicketsByStatus({
      role: req.user.role,
      userId: req.user.id
    });

    const totals = counts.reduce(
      (acc, row) => ({
        ...acc,
        [row.status]: row.total
      }),
      {}
    );

    const recent = await ticketModel.recentTickets({
      role: req.user.role,
      userId: req.user.id,
      limit: 5
    });

    return res.json({
      success: true,
      data: {
        totals,
        recent
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDashboard
};

