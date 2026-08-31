const Express = require('express');
const router = Express.Router();
const userQueries = require('../db/queries/userQueries');

router.get('/', (req, res) => {
  res.json({});
});

router.post('/', (req, res) => {
  const { email, password } = req.body.data;

  userQueries.getUserInfo(email)
    .then((user) => {
      if (user && user.password === password) {
        res.cookie('userId', user.id);
        return res.json(user);
      }

      return res.status(401).json({
        error: 'Invalid email or password'
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: 'Server error'
      });
    });
});

module.exports = router;
