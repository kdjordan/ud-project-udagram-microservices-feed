import express from 'express'
import { Router, Request, Response } from 'express'
import bodyParser from 'body-parser'

const router: Router = Router()
const app = express()

app.use(bodyParser.json())

app.listen(8080, () => {
    console.log('Feed Listening on 8080')
})

router.get('/health', (req: Request, res: Response) => {
    res.send('Feed be healthy !')
})