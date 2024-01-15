import fs from "fs"

const content = fs.readFileSync("./testbase64", "utf-8")

console.dir(content.substring(0, 9) === "JVBERi0xL")
