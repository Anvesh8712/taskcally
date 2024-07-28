const createUser = async (db, user) => {
  const result = await db.collection("users").insertOne(user);
  return { ...user, _id: result.insertedId };
};

const getUserByUID = async (db, uid) => {
  return await db.collection("users").findOne({ uid });
};

module.exports = { createUser, getUserByUID };
