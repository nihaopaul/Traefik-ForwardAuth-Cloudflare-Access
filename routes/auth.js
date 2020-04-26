const express = require('express');
const router = express.Router();
const validate = require('../authentication')

router.get('/', async (req, res, next) => {

  const { CF_Authorization } = req.cookies
  let isValid = await validate.test(CF_Authorization) 
  let status = isValid ? 200 : 403
  res.sendStatus(status)

})

module.exports = router;
