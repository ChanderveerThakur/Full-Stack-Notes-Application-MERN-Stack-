const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware")
const noteController = require("../controllers/note.controller");

const router = express.Router();

router.post("/create", authMiddleware.userAuth, noteController.createNote)


router.get("/", authMiddleware.userAuth,noteController.getAllNotes)

router.delete("/:id", authMiddleware.userAuth,noteController.deleteNote)




module.exports = router;