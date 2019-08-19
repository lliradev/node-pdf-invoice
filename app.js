const { join } = require('path');
const pdf = require('html-pdf');
const { promisify } = require('util');
const read = promisify(require('fs').readFile);
const handlebars = require('handlebars');

// PDF Options
const pdf_options = { format: 'A4', quality: 300 };

// GeneratePDF
async function generatePDF() {
  const data = {};
  data.products = [
    {
      name: 'Curso de Angular',
      price: 100
    },
    {
      name: 'Curso de Python',
      price: 100
    },
    {
      name: 'Curso de React',
      price: 100
    },
    {
      name: 'Curso de Vue',
      price: 100
    }
  ];

  const total = data.products.map(product => product.price).reduce((a, b) => a + b, 0);
  data.total = total.toFixed(2);
  data.products.forEach(product => product.price = product.price.toFixed(2));

  // Read source template
  const source = await read(join(`${__dirname}/template.html`), 'utf-8');

  // Convert to Handlebars template and add the data
  const template = handlebars.compile(source);
  const html = template(data);

  // Generate PDF and promisify the toFile function
  const p = pdf.create(html, pdf_options);
  p.toFile = promisify(p.toFile);

  // Saves the file to the File System as invoice.pdf in the current directory
  await p.toFile(`${join(__dirname, 'Invoice.pdf')}`);
}

generatePDF();