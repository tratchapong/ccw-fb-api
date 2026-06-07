import express from 'express'
import authRoute from './routes/auth.route.js'
import createHttpError from 'http-errors'
import errorMiddleware from './middlewares/error.middleware.js'
import authenticateMiddleware from './middlewares/authenticate.middleware.js'
import cors from 'cors'
import postRoute from './routes/post.route.js'

const app = express()

app.use(cors({
	origin: ["http://localhost:5173"],
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true, // allow cookies if needed
}))

app.use(express.json())

app.use('/api/auth', authRoute)
app.use('/api/post', authenticateMiddleware, postRoute)


app.use((req,res,next) => {
	return next(createHttpError[404]('Resource not found'))
	// res.status(404).json({
	// 	message : 'Not Found'
	// })
})

app.use(errorMiddleware)

export default app