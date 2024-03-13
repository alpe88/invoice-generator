const fs = require("fs");
const puppeteer = require("puppeteer");
const Squirrelly = require("squirrelly");

function generateHTML(data) {
  const sqrlTemplate = fs.readFileSync("templates/invoice1.sqrl", "utf8");

  const { vendor, client, invoice } = data;
  const templateData = {
    vendorName: vendor.name,
    clientName: client.name,
    work: invoice.work.map((item) => ({
      description: item.description,
      hours: item.hours,
      rate: item.rate,
      total: item.hours * item.rate,
    })),
  };

  return Squirrelly.render(sqrlTemplate, templateData);
}

async function generatePDF(content) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set content to page
  await page.setContent(content);

  // Generate PDF
  await page.pdf({
    path: `${__dirname}/sample.pdf`,
    format: "A4",
  });

  console.log("PDF created successfully.");

  await browser.close();
}

module.exports = { generateHTML, generatePDF };
