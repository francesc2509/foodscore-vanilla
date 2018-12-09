declare function require(module: string): any;
const commentTemplate = require('./comment.handlebars');
const profileTemplate = require('./profile.handlebars');
const restaurantTemplate = require('./restaurant.handlebars');

export {
    commentTemplate,
    profileTemplate,
    restaurantTemplate,
}