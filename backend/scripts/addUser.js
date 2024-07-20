const { sequelize, User } = require('../models');

const username = process.argv[2] || 'root';
const password = process.argv[3] || 'admin';

const exit = (code) => {
    process.exit(code);
}

const addUser = () => {
    sequelize.sync().then(() => {
        User.upsert({ username, password }).then(() => {
            console.log(`User '${username}' created`);
            exit(0);
        }).catch((err) => {
            console.log('Error creating user', err);
            exit(-1);
        });
    }).catch((err) => {
        console.log('Error in sequelize sync', err);
        exit(-1);
    });
}

addUser();
