const fs = require("fs");
const Squirrelly = require("squirrelly");

export function generateInvoicePDF(vendor, client, invoice) {
  // Read the SquirrellyJS template file
  fs.readFile("invoice_template.sqrl", "utf8", (err, sqrlTemplate) => {
    if (err) {
      console.error("Error reading SquirrellyJS template file:", err);
      return;
    }

    // Prepare data to be passed to the template
    const data = {
      vendorName: vendor.name,
      clientName: client.name,
      work: invoice.work.map((item) => ({
        description: item.description,
        hours: item.hours,
        rate: item.rate,
        total: item.hours * item.rate,
      })),
    };

    // Compile the SquirrellyJS template
    const compiledTemplate = Squirrelly.compile(sqrlTemplate);

    // Render the compiled template with data
    const renderedTemplate = Squirrelly.render(compiledTemplate, data);

    // Write the rendered template to a PDF file
    fs.writeFile(
      `invoice_${invoice.invoiceNumber}.pdf`,
      renderedTemplate,
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing PDF file:", err);
          return;
        }
        console.log(
          `PDF generated successfully for invoice ${invoice.invoiceNumber}`
        );
      }
    );
  });
}
