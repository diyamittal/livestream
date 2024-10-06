const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/livestream', {useNewUrlParser: true, useUnifiedTopology: true});

const OverlaySchema = new mongoose.Schema({
    text: String,
    position: String,
    size: String
})

const Overlay = mongoose.model('Overlay', OverlaySchema);

app.post('/overlays', async(req, res)=>{
    const overlay = new Overlay(req.body);
    await overlay.save();
    res.status(201).send(overlay);
})

app.get('/overlays', async(req, res)=>{
    const overlays = await Overlay.find();
    res.send(overlays);
})

app.put('/overlays/:id', async (req, res)=>{
    const overlay = await Overlay.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.send(overlay);
})

app.delete('/overlays/:id', async(req, res)=>{
    await Overlay.findByIdAndDelete(req.params.id);
    res.status(204).send();
})

const port = 5000;
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})