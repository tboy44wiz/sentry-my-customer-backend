const {config , uploader} = require('cloudinary');

const cloudConfig = (req,res,next) => {
    config({
        cloud_name: "dl8587hyx",
        api_key: "257517161539154",
        api_secret: 'HZ5Jn5-N94Pr_2z_e-FKPWzDRRI',
        });
        next();
}

module.exports = {
    cloudConfig,
    uploader
}