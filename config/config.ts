import dotenv from 'dotenv';

dotenv.config({
    path: `.env.${process.env.ENV || 'qa'}`
});

export const config = {
    baseUrl: process.env.BASE_URL || '',
    username: process.env.APP_USERNAME || '',
    password: process.env.APP_PASSWORD || ''
};