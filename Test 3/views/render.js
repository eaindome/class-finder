const ejs = require('ejs');
const fs = require('fs');

// Define the data for your EJS template
const data = {
  title: 'My Website',
  message: 'Welcome to my website!'
};

// Render the EJS template
ejs.renderFile('./reset-password.ejs', data, (err, renderedHtml) => {
  if (err) {
    console.error('Error rendering EJS template:', err);
  } else {
    // Write the rendered HTML to a file
    fs.writeFile('output.html', renderedHtml, (err) => {
      if (err) {
        console.error('Error writing output file:', err);
      } else {
        console.log('EJS template rendered and HTML file generated!');
      }
    });
  }
});
