'use strict';

/**
 * artist service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::artist.artist');
