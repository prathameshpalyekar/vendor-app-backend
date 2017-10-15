import Fs from 'fs';
import Dotenv from 'dotenv';

module.exports = function() {
    let envFilePath = process.env.APP_ROOT_PATH + "/.env",
        stats;
    try {
        stats = Fs.statSync(envFilePath);
        Dotenv.config({
            path : envFilePath
        });
    } catch (e){
        throw new Error("Missing .env file. please refer Readme.md");
    }
};