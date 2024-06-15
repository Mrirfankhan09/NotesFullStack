const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notesSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    // createdAt: { type: Date, default: Date.now }
})

const NotesScheam = mongoose.model('NotesScheam',notesSchema);
module.exports = NotesScheam;