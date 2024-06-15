const express = require('express');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const path = require('path');
const User = require('../model/User');
const Note = require('../model/NotesSchema');

const fs = require('fs')
const privateKey = fs.readFileSync(
    path.resolve(__dirname, '../privatekey.key'),
    'utf-8'
);
// console.log(privateKey)
exports.HomePage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
}
exports.singuppage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
}
exports.loginpage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
}
exports.signup = async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password)
    try {
        const existinguser = await User.findOne({ username });
        // console.log(existinguser)
        if (existinguser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword)
        const newUser = new User({ username, password: hashedPassword });
        // console.log(newUser)
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' })

    }
    catch {
        res.status(500).json({ message: 'Server error' })
    }
}

exports.login = async (req, res) => {
    console.log(req.body)
    const { username, password } = req.body;
    console.log(username, password)
    try {
        const user = await User.findOne({ username })
        // console.log(user);
        if (!user) {
            return res.status(400).json({ message: 'user not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }


        const token = jwt.sign({ id: user._id }, privateKey, {
            algorithm: 'RS256',
        });
        // console.log(token)
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
exports.createNote = async (req, res) => {
    // console.log(req.body);
    const { title, content } = req.body;
    console.log(req.user)

    try {
        const newNote = new Note({
            userId: req.user,
            title,
            content
        });

        const note = await newNote.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

}
exports.getNotes = async (req, res) => {
    // console.log(req.body.userId)
    // console.log('hi');

    // const userid = req.body.userId;
    try {
        const notes = await Note.find({ userId: req.user });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
exports.updateNote = async (req, res) => {
    const { title, content } = req.body;
    // console.log(req.body,req.user);

    try {
        const note = await Note.findById(req.params.id);
        // console.log(note.userId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.userId.toString() !== req.user) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        note.title = title || note.title;
        note.content = content || note.content;

        const updatedNote = await note.save();

        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
exports.delete = async (req, res) => {
    console.log('helo')
    console.log(req.params.id);
    try {
        const note = await Note.findById(req.params.id);
        console.log(note);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        // console.log(note.userId.toString() !== req.user,req.user,note.userId.toString());
        if (note.userId.toString() !== req.user) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        console.log("hello")
        await Note.findByIdAndDelete(req.params.id);
        console.log('Note removed');
        res.json({ message: 'Note removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error ' });
    }
}
exports.getnotebyid = async (req, res) => {
    const { title, content } = req.body;
    // console.log(req.body,req.user);

    try {
        const note = await Note.findById(req.params.id);
        // console.log(note.userId);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        console.log(note.userId.toString(),req.user)

        if (note.userId.toString() !== req.user) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}