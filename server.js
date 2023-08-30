const express = require("express")
const mysql = require("mysql")
const nodemon = require("nodemon")
const nodemailer = require('nodemailer');
const cors = require("cors");
const bodyParser = require('body-parser');
const app=express()
app.use(cors())
app.use(bodyParser.json());
const db=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"root1234",
  database:"gmm"
})

const tables = [
  {
    name: 'users',
    query: `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        category VARCHAR(100),
        course VARCHAR(100),
        comment TEXT
      );
    `
  },
  {
    name: 'placement',
    query: `
      CREATE TABLE IF NOT EXISTS placement (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(255),
        mobile_number VARCHAR(20),
        company_name VARCHAR(255),
        designation VARCHAR(255)
      );
    `
  },
  {
    name: 'studyabroad',
    query: `
      CREATE TABLE IF NOT EXISTS studyabroad (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        course VARCHAR(100),
        category VARCHAR(100),
        phoneNumber VARCHAR(20),
        city VARCHAR(100),
        comment TEXT
      );
    `
  }
];

function createTable(tableName, createTableQuery) {
  db.query(createTableQuery, (err, result) => {
    if (err) {
      console.error(`Error creating "${tableName}" table:`, err.message);
    } else {
      console.log(`Successfully created "${tableName}" table.`);
    }
  });
}

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the database.');
  
  tables.forEach((table) => {
    createTable(table.name, table.query);
  });
});



app.listen(3005, () => {
  console.log("listening on port 3005");
});

app.post('/register', (req, res) => {
  try {
    const { name, email, phoneNumber, course, comment,Category } = req.body;
    
    if (!name || !email || !phoneNumber || !course|| !Category) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert the new user into the MySQL database
    db.query(
      'INSERT INTO users (name, email, phone_number, course, comment,category) VALUES (?, ?, ?, ?, ?,?)',
      [name, email, phoneNumber, course, comment,Category ],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error:err  });
        }

        // Send an email
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'ecommerceapp8@gmail.com',
            pass: 'cuesoyfbusquxakg',
          },
        });

        const mailOptions = {
          from: 'ecommerceapp8@gmail.com',
          to: email,
          subject: 'Registration Confirmation',
          text: `Thank you for contacting us. You have selected the service: ${course}. We will get back to you soon.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
          // Send a response message regardless of the email status
          res.json({ success: 'Thank you for Contacting us. We will get back to you soon' });
        });

        // Send an email to 'abcd@gmail.com'
        const mailOptionsABC = {
          from: 'ecommerceapp8@gmail.com',
          to: 'kapilrajreddy@gmail.com',
          subject: 'New Registration',
          text: `A new user registered with the following details:
              Name: ${name}
              Email: ${email}
              Phone Number: ${phoneNumber}
              Category:${Category}
              Course: ${course}
              Comment: ${comment}`,
        };

        transporter.sendMail(mailOptionsABC, (error, info) => {
          if (error) {
            console.error('Error sending email to abcd@gmail.com:', error);
          } else {
            console.log('Email sent to abcd@gmail.com:', info.response);
          }
        });
      }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send({"error":'Internal Server Error'});
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});





  app.post('/placement', (req, res) => {
    const { name, email, mobileNumber, companyName, designation } = req.body;
    
    // Validate the required fields
    if (!name || !email || !mobileNumber || !companyName || !designation) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert the new user into the MySQL database
    db.query(
      'INSERT INTO placement (name , email, mobile_number, company_name, designation) VALUES (?, ?, ?, ?,?)',
      [ name, email, mobileNumber, companyName, designation],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error:err  });
        }
  
    // Create a Nodemailer transporter using your email service credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail', // e.g., 'Gmail'
      auth: {
        user: 'ecommerceapp8@gmail.com',
        pass: 'cuesoyfbusquxakg',
      },
    });
  
    // Email content to the primary recipient
    const mailOptions = {
      from: 'ecommerceapp8@gmail.com',
      to: email,
      subject: 'Hello from the Send Email API',
      text: `Dear ${name},\n\nThank you for providing your information. We will contact you soon.\n\nBest regards,\nThe Send Email API Team`,
    };
  
    // Email content to the additional recipient
    const mailOptionsABC = {
      from: 'ecommerceapp8@gmail.com',
      to: 'kapilrajreddy@gmail.com',
      subject: 'Placement Team',
      text: `A new company  registered with the following details:
            Name: ${name}
            Email: ${email}
            Phone Number: ${mobileNumber}
            Company Name: ${companyName}
            Designation: ${designation}`,
    };
  
    // Send the email to the primary recipient
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send email' });
      }
  
      console.log('Email sent to primary recipient:', info.response);
  
      // Send the email to the additional recipient
      transporter.sendMail(mailOptionsABC, (error, info) => {
        if (error) {
          console.log('Error sending email to additional recipient:', error);
          return res.status(500).json({ error: 'Failed to send email to additional recipient' });
        }
  
        console.log('Email sent to additional recipient:', info.response);
        res.json({ success: 'Thank you for Contacting us. We will get back to you soon' });
      });
    });
  });
});


app.post('/studyabroad', (req, res) => {
  try {
    const { name,email,course,category,phoneNumber,city,comment } = req.body;
    if (!name || !email || !phoneNumber || !course|| !category || !city) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert the new user into the MySQL database
    db.query(
      'INSERT INTO studyabroad (name,email,course,category,phoneNumber,city,comment) VALUES (?, ?, ?, ?, ?,?,?)',
      [name, email,course,category, phoneNumber,city,comment],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error:err  });
        }

        // Send an email
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'ecommerceapp8@gmail.com',
            pass: 'cuesoyfbusquxakg',
          },
        });

        const mailOptions = {
          from: 'ecommerceapp8@gmail.com',
          to: email,
          subject: 'Registration Confirmation',
          text: `Thank you for contacting us. You have selected the service: ${course}. We will get back to you soon.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
          // Send a response message regardless of the email status
          res.json({ success: 'Thank you for Contacting us. We will get back to you soon' });
        });

        // Send an email to 'abcd@gmail.com'
        const mailOptionsABC = {
          from: 'ecommerceapp8@gmail.com',
          to: 'kapilrajreddy@gmail.com',
          subject: 'Study Abroad',
          text: `A new user registered with the following details:
              Name: ${name}
              Email: ${email}
              Phone Number: ${phoneNumber}
              Category:${category}
              Course: ${course}
              Comment: ${comment}
              City:${city}`,
        };

        transporter.sendMail(mailOptionsABC, (error, info) => {
          if (error) {
            console.error('Error sending email to abcd@gmail.com:', error);
          } else {
            console.log('Email sent to abcd@gmail.com:', info.response);
          }
        });
      }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send({"error":'Internal Server Error'});
  }
});



