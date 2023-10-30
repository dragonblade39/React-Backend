const express = require("express");
const router = express.Router();
const loginSchema = require("../schema/fitnessSchema");

// router.post("/create-fitness", (req, res, next) => {
//   const { name, username, email, password, password1, gender } = req.body;
//   if (password === password1) {
//     loginSchema
//       .create({ name, username, email, password, gender })
//       .then((data) => {})
//       .catch((err) => {
//         next(err); // Pass the error to the error handling middleware
//       });
//   } else {
//     console.log("Passwords do not match.");
//     res.json("Passwords not matched");
//   }
// });

router.post("/create-fitness", async (req, res, next) => {
  const { name, username, email, password, password1, gender } = req.body;

  // Check if a user with the same username already exists
  const existingUser = await loginSchema.findOne({ username: username });
  const existingEmail = await loginSchema.findOne({ email: email });

  if (existingUser) {
    return res
      .status(400)
      .json("Username already exists. Please choose a different username.");
  }
  if (existingEmail) {
    return res
      .status(400)
      .json("Email already exists. Please choose a different email.");
  }

  if (password === password1) {
    try {
      // Create a new user record
      const newUser = await loginSchema.create({
        name,
        username,
        email,
        password,
        gender,
      });
      return res.json("User added successfully");
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  } else {
    console.log("Passwords do not match.");
    res.status(400).json("Passwords not matched");
  }
});

router.get("/", (req, res, next) => {
  loginSchema
    .find()
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      return next(err);
    });
});

router.post("/forgot-password", (req, res) => {
  const { name, username, password } = req.body;
  loginSchema
    .findOne({ username: username })
    .then((login) => {
      if (login) {
        if (login.name == name) {
          login.password = password;
          login
            .save()
            .then(() => {
              res.json("Password Updated");
            })
            .catch((err) => {
              console.error(err);
              res.json("Error updating password");
            });
        } else {
          res.json("Credentials incorrect");
        }
      } else {
        res.json("No record exists");
      }
    })
    .catch((err) => {
      console.error(err);
      res.json("Error finding user");
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  loginSchema.findOne({ username: username }).then((login) => {
    if (login) {
      if (login.password === password) {
        return res.status(200).json("login successfull");
      } else {
        return res.status(400).json("Password incorrect");
      }
    } else {
      return res.status(400).json("No record exits");
    }
  });
});

module.exports = router;
