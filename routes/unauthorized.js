var express = require('express');
var router = express.Router();

/* GET unauthorized page. */
router.get('/', function(req, res, next) {
  res.render('unauthorized', { title: 'Unauthorized' });
});

module.exports = router;

/**
 * @wagger
 * /unauthorized:
 *  get:
 *    summary: Get unauthorized page
 *    responses:
 *      200:
 *        description: An unauthorized page
 *      401:
 *         description: Unauthorized
 * 
 * 
 */