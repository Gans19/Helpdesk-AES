const { matchedData } = require("express-validator");
const ticketModel = require("../models/ticketModel");
const commentModel = require("../models/commentModel");

const list = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      categoryId: req.query.categoryId,
    };
    const tickets = await ticketModel.listTickets({
      role: req.user.role,
      userId: req.user.id,
      filters,
    });

    return res.json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    return next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const ticket = await ticketModel.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    if (req.user.role === "user" && ticket.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this ticket",
      });
    }

    return res.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    return next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = matchedData(req);
    const attachment = req.file ? req.file.filename : null;

    const ticket = await ticketModel.createTicket({
      title: data.title,
      description: data.description,
      priority: data.priority,
      categoryId: data.categoryId,
      userId: req.user.id,
      attachment,
    });

    return res.status(201).json({
      success: true,
      message: "Ticket created",
      data: ticket,
    });
  } catch (error) {
    return next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const ticket = await ticketModel.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    const data = matchedData(req, {
      locations: ["body"],
      includeOptionals: true,
    });
    const rawAssignedTo = Object.prototype.hasOwnProperty.call(
      req.body,
      "assignedTo"
    )
      ? req.body.assignedTo
      : undefined;

    if (req.user.role === "user" && ticket.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this ticket",
      });
    }

    const payload = {};
    if (req.user.role === "user") {
      if (ticket.status !== "open") {
        return res.status(400).json({
          success: false,
          message: "Ticket locked; contact support for changes",
        });
      }
      if (data.title) payload.title = data.title;
      if (data.description) payload.description = data.description;
      if (req.file) payload.attachment = req.file.filename;
    } else {
      if (data.title) payload.title = data.title;
      if (data.description) payload.description = data.description;
      if (data.priority) payload.priority = data.priority;
      if (data.status) payload.status = data.status;
      if (rawAssignedTo === "") {
        payload.assignedTo = null;
      } else if (data.assignedTo !== undefined) {
        payload.assignedTo = data.assignedTo;
      }
      if (req.file) payload.attachment = req.file.filename;
    }

    const updated = await ticketModel.updateTicket(id, payload);

    return res.json({
      success: true,
      message: "Ticket updated",
      data: updated,
    });
  } catch (error) {
    return next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const ticket = await ticketModel.findById(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    await ticketModel.deleteTicket(id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

const listComments = async (req, res, next) => {
  try {
    const ticketId = Number(req.params.id);
    const ticket = await ticketModel.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    if (req.user.role === "user" && ticket.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this ticket",
      });
    }

    const comments = await commentModel.listByTicketId(ticketId);

    const map = new Map();
    const roots = [];
    comments.forEach((comment) => {
      const node = { ...comment, replies: [] };
      map.set(comment.id, node);
    });

    comments.forEach((comment) => {
      const node = map.get(comment.id);
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) parent.replies.push(node);
      } else {
        roots.push(node);
      }
    });

    return res.json({
      success: true,
      data: roots,
    });
  } catch (error) {
    return next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const ticketId = Number(req.params.id);
    const ticket = await ticketModel.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    if (req.user.role === "user" && ticket.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this ticket",
      });
    }

    const data = matchedData(req);

    const comment = await commentModel.createComment({
      ticketId,
      userId: req.user.id,
      parentCommentId: data.parentCommentId || null,
      body: data.body,
    });

    return res.status(201).json({
      success: true,
      message: "Comment added",
      data: comment,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  list,
  getById,
  create,
  update,
  destroy,
  listComments,
  addComment,
};
