/**
 * Master Script to generate all 4 Signature Birthday Templates
 */

const path = require('path');
const buildCinematic3D = require('./tpl_midnight_royal');
const buildRetroPolaroid = require('./tpl_retro_polaroid');
const buildCelestialStars = require('./tpl_celestial_stars');
const buildChampagneScratch = require('./tpl_champagne_scratch');

const baseDir = path.join(__dirname, '..', '..', 'templates');

console.log('🚀 Building all 4 High-End Birthday Signature Templates into:', baseDir);

buildCinematic3D(baseDir);
buildRetroPolaroid(baseDir);
buildCelestialStars(baseDir);
buildChampagneScratch(baseDir);

console.log('🎉 All 4 Signature Templates successfully created and ready!');
