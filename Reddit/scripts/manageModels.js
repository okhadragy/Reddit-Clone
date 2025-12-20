// File: scripts/manageModels.js
const connectDB = require("../config/db"); // Ensure this path matches your db config location

const insertModel = async (modelName, filePath) => {
  try {
    // Looks for model in ../models/
    const Model = require(`../models/${modelName}.model`);
    // Looks for data file relative to this script
    const modelData = require(filePath);
    
    await connectDB();

    for (const model of modelData) {
      try {
        await Model.create(model);
        console.log(`Inserted ${modelName}: ${model.title || model.name}`);
      } catch (err) {
        console.error(`Failed to insert: ${err.message}`);
      }
    }
  } catch (error) {
    console.error(`Error:`, error.message);
    process.exit(1);
  }
};

const command = process.argv[2];
const modelName = process.argv[3];
const filePath = process.argv[4];

(async () => {
  if (command === "--insert") {
    await insertModel(modelName, filePath);
  } else {
    console.log("Unknown command. Use --insert");
  }
  process.exit(0);
})();