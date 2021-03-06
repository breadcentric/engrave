let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let blogSchema = new Schema({

    steem_username: String,
    email: String,
    port: Number,
    domain: String,
    created: Date,
    tier: Number,
    configured: Boolean,
    
    deployed: Boolean,

    author_name: String,
    author_surname: String,
    author_bio: String,
    author_image_url: String,

    link_facebook: String,
    link_twitter: String,
    link_linkedin: String,
    link_instagram: String,

    blog_title: String,
    blog_slogan: String,
    blog_logo_url: String,
    blog_main_image: String,

    opengraph_default_image_url: String,
    opengraph_default_description: String,

    onesignal_app_id: String,
    onesignal_api_key: String,
    onesignal_body_length: Number,
    onesignal_logo_url: String,

    analytics_gtag: String,
    webmastertools_id: String,
    frontpage_language: String,
    theme: String,
    show_only_categorized_posts: Boolean,
    show_everything: Boolean,

    posts_per_category_page: Number,
    load_more_posts_quantity: Number,

    categories: [
        {
            steem_tag: String,
            slug: String,
            name: String
        }
    ],

    single: {
        show_author_box: Boolean,
        show_similar: Boolean
    },

    sidebar: {
        show_latest: Boolean,
        show_featured: Boolean
    }
});

module.exports = mongoose.model('blogs', blogSchema);