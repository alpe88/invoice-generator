const fs = require("fs");
const { Command } = require("commander");
const program = new Command();
const { generateHTML, generatePDF } = require("./generate.js");

program
  .name("invoice-generator")
  .version("0.0.3")
  .description("Create an invoice pdf based on squirrelly templates");

program
  .command("create")
  .option("-d, --data <data>", "-d data/invoice.json")
  .parse(process.argv)
  .action(async (options) => {
    if (options.data) {
      const jsonDataPath = options.data;

      fs.readFile(jsonDataPath, "utf8", (err, jsonData) => {
        if (err) {
          console.error("Error reading JSON file:", err);
          return;
        }
        // Parse the JSON data
        const data = JSON.parse(jsonData);
        const renderedHTML = generateHTML(data); // Generate HTML content from data
        generatePDF(renderedHTML); // Generate PDF using Puppeteer
      });
    } else {
      console.error(
        "Please provide the path to the JSON file containing data using -d option."
      );
    }
  });

program.parse(process.argv);
