const express = require('express')

import { Router, Application, Request, Response } from 'express';
import {NextFunction} from 'connect';
import {sequelize} from './sequelize';
import { User } from './models/User';
import { FeedItem } from './models/FeedItem';
import { AuthRouter, requireAuth } from './auth.router';
import * as jwt from 'jsonwebtoken';
import * as AWS from './aws';


(async() =>{
  
  const app: Application = express();

  const router: Router = Router();

  app.use(router)

  const V0_USER_MODEL = [User]
  const V0_FEEDITEM_MODEL = [FeedItem]

  await sequelize.addModels(V0_USER_MODEL)
  await sequelize.addModels(V0_FEEDITEM_MODEL)
  
  router.get('/favicon.ico', (req, res) => res.status(204));

  router.get('/health', (req: Request , res: Response) => {
    res.send('FEED SERVICE UP')
    return
  })
  
 // Get all feed items
  router.get('/', async (req: Request, res: Response) => {
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    items.rows.map((item) => {
      if (item.url) {
        item.url = AWS.getGetSignedUrl(item.url);
      }
    });
    res.send(items);
    return
  });
  
  // Get a feed resource
  router.get('/:id',
      async (req: Request, res: Response) => {
        const {id} = req.params;
        const item = await FeedItem.findByPk(id);
        res.send(item);
      });
  
  // Get a signed url to put a new item in the bucket
  router.get('/signed-url/:fileName',
       requireAuth,
      async (req: Request, res: Response) => {
        const {fileName} = req.params;
        const url = AWS.getPutSignedUrl(fileName);
        res.status(201).send({url: url});
      });
  
  // Create feed with metadata
  router.post('/',
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

      app.listen(8080, () => {
        console.log('listening on 8080')
    })
})();

