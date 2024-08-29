import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "usedNames.txt");

export const addUsedName = (name: string) => {
  try {
    fs.appendFileSync(filePath, " " + name, "utf8");
    console.log("Name saved to used list");
  } catch (err) {
    console.error("Error saving name:", err);
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
