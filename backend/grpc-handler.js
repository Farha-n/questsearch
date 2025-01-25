const Question = require("./models/question"); // Import Mongoose model

/**
 * gRPC Handler for searching questions.
 * @param {Object} call - gRPC call containing the request.
 * @param {Function} callback - Callback to send the response.
 */
const searchQuestions = async (call, callback) => {
  const { query, page, pageSize } = call.request;
  const skip = (page - 1) * pageSize; // Calculate the number of documents to skip

  try {
    // Fetch paginated questions from MongoDB
    const questions = await Question.find({ title: { $regex: query, $options: "i" } })
      .skip(skip)
      .limit(pageSize);

    // Fetch the total count for pagination
    const total = await Question.countDocuments({ title: { $regex: query, $options: "i" } });

    // Transform MongoDB documents to gRPC response format
    const formattedQuestions = questions.map((q) => ({
      id: q._id.toString(),
      title: q.title,
      type: q.type, // MCQ or MCM
      options: q.options.map((option) => ({
        text: option.text,
        isCorrectAnswer: option.isCorrectAnswer, // Changed from isCorrect to isCorrectAnswer to match schema
      })),
    }));

    // Send response back to the client
    callback(null, {
      questions: formattedQuestions,
      total,
    });
  } catch (err) {
    console.error("Error in searchQuestions:", err);
    callback(err, null); // Handle errors by passing them to the callback
  }
};

module.exports = { searchQuestions };