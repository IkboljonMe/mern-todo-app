const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = () => {
    const client = getConnectedClient();
    const collection = client.db("todosdb").collection("todos");
    return collection;
}

// GET /todos
router.get("/todos", async (req, res, next) => {
    try {
        const collection = getCollection();
        const todos = await collection.find({}).toArray();

        res.status(200).json(todos);
    } catch (error) {
        next(error);
    }
});

// POST /todos
router.post("/todos", async (req, res, next) => {
    try {
        const collection = getCollection();
        let { todo } = req.body;

        if (!todo) {
            return res.status(400).json({ mssg: "error no todo found"});
        }

        todo = (typeof todo === "string") ? todo : JSON.stringify(todo);

        const newTodo = await collection.insertOne({ todo, status: false });

        res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
    } catch (error) {
        next(error);
    }
});

// DELETE /todos/:id
router.delete("/todos/:id", async (req, res, next) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ mssg: "invalid id"});
        }
        const collection = getCollection();
        const _id = new ObjectId(req.params.id);

        const deletedTodo = await collection.deleteOne({ _id });

        if (deletedTodo.deletedCount === 0) {
            return res.status(404).json({ mssg: "todo not found"});
        }

        res.status(200).json(deletedTodo);
    } catch (error) {
        next(error);
    }
});

// PUT /todos/:id
router.put("/todos/:id", async (req, res, next) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ mssg: "invalid id"});
        }
        const collection = getCollection();
        const _id = new ObjectId(req.params.id);
        const { status } = req.body;

        if (typeof status !== "boolean") {
            return res.status(400).json({ mssg: "invalid status"});
        }

        // status is the new value the todo should have
        const updatedTodo = await collection.updateOne({ _id }, { $set: { status } });

        if (updatedTodo.matchedCount === 0) {
            return res.status(404).json({ mssg: "todo not found"});
        }

        res.status(200).json(updatedTodo);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
