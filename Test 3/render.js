const ejs = require('ejs');
const path = require('path');

const renderResetPasswordPage = (req, res, email, token) => {
  // Define the data for your EJS template
  const data = {
    email: email,
    token: token,
  };
  console.log('Data', data);

  // Render the EJS template
  ejs.renderFile(path.join(__dirname, 'views', 'reset-password.ejs'), data, (err, renderedHtml) => {
    if (err) {
      console.error('Error rendering EJS template:', err);
      res.status(500).json({ error: 'Internal Server Error (EJS error)' });
    } else {
      // Send the rendered HTML as the response
      res.send(renderedHtml);
    }
  });
};

module.exports = {
  renderResetPasswordPage: renderResetPasswordPage
};



/*const ejs = require('ejs');
const path = require('path');

const renderResetPasswordPage = (req, res) => {
  //const { email, token } = req.params;
  const email = req.params.email;
  const token = req.params.token;

  // Define the data for your EJS template
  const data = {
    email: email,
    token: token,
  };

  // Render the EJS template
  ejs.renderFile(path.join(__dirname, 'views', 'reset-password.ejs'), data, (err, renderedHtml) => {
    if (err) {
      console.error('Error rendering EJS template:', err);
      res.status(500).json({ error: 'Internal Server Error (EJS error)' });
    } else {
      // Send the rendered HTML as the response
      res.send(renderedHtml);
    }
  });
};

module.exports = {
  renderResetPasswordPage: renderResetPasswordPage
};*/


