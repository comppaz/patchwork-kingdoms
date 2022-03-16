'use strict';

/**
 * advisor service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::advisor.advisor');
