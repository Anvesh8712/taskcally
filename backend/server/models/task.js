const { ObjectId } = require("mongodb");

const createTask = async (db, task) => {
  const result = await db.collection("task").insertOne(task);
  return { ...task, _id: result.insertedId };
};

const getTasksByUserId = async (db, userId) => {
  return await db.collection("task").find({ userId }).toArray();
};

const updateTask = async (db, taskId, updateFields) => {
  try {
    const result = await db
      .collection("task")
      .findOneAndUpdate(
        { _id: new ObjectId(taskId) },
        { $set: updateFields },
        { returnOriginal: false, returnDocument: "after" }
      );

    return result;
  } catch (error) {
    console.error("Error in updateTask:", error);
    throw error;
  }
};

const deleteTask = async (db, taskId) => {
  await db.collection("task").deleteOne({
    _id: new ObjectId(taskId),
  });
};

module.exports = { createTask, getTasksByUserId, updateTask, deleteTask };
