require('dotenv').config()
import {Sequelize} from 'sequelize-typescript';
import {config} from './config';

const c = config
console.log(c)

export const sequelize = new Sequelize({
  'username': c.username,
  'password': c.password,
  'database': c.database,
  'host': c.host,

  'dialect': 'postgres',
  'storage': ':memory:',
});
