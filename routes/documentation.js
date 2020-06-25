const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const router = express.Router();

const swaggerDocument = YAML.load('./swagger.yaml');

router.use('/documentation', swaggerUi.serve);
router.get('/documentation', swaggerUi.setup(swaggerDocument));

module.exports = router
