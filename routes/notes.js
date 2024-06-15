const express = require('express');
const router = express.Router();
const notesController = require('../controller/notes');
const auth = require('../controller/auth')
router.get('/',notesController.HomePage);
router.post('/singup',notesController.signup);
router.post('/login',notesController.login);
router.get('/loginpage',notesController.loginpage);
router.get('/singuppage',notesController.singuppage);
router.post('/notes',auth,notesController.createNote);
router.get('/notes',auth,notesController.getNotes);
router.get('/notes/:id',auth,notesController.getnotebyid);
router.put('/notes/:id',auth,notesController.updateNote);
router.delete('/notes/:id',auth,notesController.delete);

module.exports = router;