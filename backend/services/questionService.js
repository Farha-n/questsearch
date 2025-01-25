const Question = require("../models/question");

const searchQuestions = async (call, callback) => {
  const { query, page, pageSize } = call.request;
  const skip = (page - 1) * pageSize;

  try {
    const results = await Question.find({ title: { $regex: query, $options: "i" } })
      .skip(skip)
      .limit(pageSize);

    const total = await Question.countDocuments({ title: { $regex: query, $options: "i" } });

    callback(null, {
      questions: results.map((q) => ({
        id: q._id.toString(),
        type: q.type,
        title: q.title,
      })),
      total,
    });
  } catch (err) {
    callback(err, null);
  }
};

module.exports = { searchQuestions };
