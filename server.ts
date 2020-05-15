const express = require('express')

import { Request, Response } from 'express';
import {NextFunction} from 'connect';
import {sequelize} from './sequelize';
import { User } from './models/User';
import { FeedItem } from './models/FeedItem';
import { AuthRouter, requireAuth } from './auth.router';
import * as jwt from 'jsonwebtoken';
import * as AWS from './aws';
import * as c from './config';

(async() =>{
  
  const app = express();

  const V0_USER_MODEL = [User]
  const V0_FEEDITEM_MODEL = [FeedItem]

  await sequelize.addModels(V0_USER_MODEL)
  await sequelize.addModels(V0_FEEDITEM_MODEL)
  
  app.listen(8081, () => {
      console.log('listening on 8081')
  })
  
  // Get all feed items
  app.get('/', async (req: Request, res: Response) => {
    // res.send('FEED UP and healthy')
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    items.rows.map((item) => {
      if (item.url) {
        item.url = AWS.getGetSignedUrl(item.url);
      }
    });
    res.send(items);
  });
  
  // Get a feed resource
  app.get('/:id',
      async (req: Request, res: Response) => {
        const {id} = req.params;
        const item = await FeedItem.findByPk(id);
        res.send(item);
      });
  
  // Get a signed url to put a new item in the bucket
  app.get('/signed-url/:fileName',
      requireAuth,
      async (req: Request, res: Response) => {
        const {fileName} = req.params;
        const url = AWS.getPutSignedUrl(fileName);
        res.status(201).send({url: url});
      });
  
  // Create feed with metadata
  app.post('/',
      requireAuth,
      async (req: Request, res: Response) => {
        const caption = req.body.caption;
        const fileName = req.body.url; // same as S3 key name
  
        if (!caption) {
          return res.status(400).send({message: 'Caption is required or malformed.'});
        }
  
        if (!fileName) {
          return res.status(400).send({message: 'File url is required.'});
        }
  
        const item = await new FeedItem({
          caption: caption,
          url: fileName,
        });
  
        const savedItem = await item.save();
  
        savedItem.url = AWS.getGetSignedUrl(savedItem.url);
        res.status(201).send(savedItem);
      });
})();

