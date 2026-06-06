const noteModel = require("../models/note.model");

async function createNote(req, res) {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const note = await noteModel.create({
      title: title.trim(),
      description: description?.trim() || "",
      userId: req.user.id,
    });

    return res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to create note",
    });
  }
}

async function getAllNotes(req, res) {
  try {
    const notes = await noteModel
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Notes fetched successfully",
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to fetch notes",
    });
  }
}

async function deleteNote(req, res) {
  try {
    const { id } = req.params;

    const note = await noteModel.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    await noteModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete note",
    });
  }
}

module.exports = { createNote, getAllNotes, deleteNote };
