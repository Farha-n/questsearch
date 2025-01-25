require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const mongoose = require("mongoose");
const path = require("path");
const { searchQuestions } = require("./grpc-handler");

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => console.log("MongoDB Atlas connected"));
mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err));

// Load Proto File
const PROTO_PATH = path.join(__dirname, "questions.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const questionProto = grpc.loadPackageDefinition(packageDefinition).QuestionSearch;

// Start gRPC Server
const grpcServer = new grpc.Server();
grpcServer.addService(questionProto.QuestionSearch.service, { searchQuestions });
grpcServer.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
  console.log("gRPC server running on port 50051");
  grpcServer.start((err) => {
    if (err) console.error('Error starting server:', err);
  });
});

// REST Proxy
const app = express();
app.use(bodyParser.json());

app.post("/search", async (req, res) => {
  const { query, page, pageSize } = req.body;

  const call = {
    request: { query, page, pageSize },
  };

  searchQuestions(call, (err, response) => {
    if (err) {
      console.error("Error calling gRPC:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.json({
      questions: response.questions,
      total: response.total
    });
  });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`REST API running on port ${PORT}`));