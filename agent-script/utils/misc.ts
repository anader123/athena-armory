const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "usedNames.txt");

export const addUsedName = (name: string) => {
  try {
    fs.appendFileSync(filePath, " " + name, "utf8");
    console.log("String appended successfully.");
  } catch (err) {
    console.error("Error appending string:", err);
  }
};

export const getUsedNames = () => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data;
  } catch (err) {
    console.error("Error retrieving string:", err);
  }
};
