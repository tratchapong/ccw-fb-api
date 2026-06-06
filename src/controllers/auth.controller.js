import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import createHttpError from 'http-errors'
// import identityKeyUtil from '../utils/identity-key.util.js'
import { registerSchema, loginSchema } from '../validations/schema.js'
import { getUserBy } from '../services/user.service.js'

export async function register(req, res, next) {
	const { identity, firstName, lastName, password, confirmPassword } = req.body
	// // validation
	const data = await registerSchema.parseAsync(req.body)
	const identityKey = data.email ? 'email' : 'mobile'

	console.log(data)

	// find user for non-duplicate
	// const haveUser = await prisma.user.findUnique({
	// 	where: { [identityKey]: data[identityKey] }
	// })
	const haveUser = await getUserBy(identityKey, data[identityKey])
	if (haveUser) {
		return next(createHttpError[409]('This user already register'))
	}

	// const result = await prisma.user.create({ data: data })
	const result = await createUser(data)
	res.json({
		message: 'Register Successful',
		identityKey: identityKey,
		result: result
	})
}

export async function login(req, res, next) {
	// validation
	const data = loginSchema.parse(req.body)
	const identityKey = data.email ? 'email' : 'mobile'
 // find user in DB
//  const foundUser = await prisma.user.findFirst({
//    where: { [identityKey]: data[identityKey] }
//  })
const foundUser = await getUserBy(identityKey, data[identityKey])
 if (!foundUser) {
   return next(createHttpError[401]('Invalid login 1'))
 }
 // check password
 const pwOk = await bcrypt.compare(data.password, foundUser.password)
 if (!pwOk) { return next(createHttpError[401]('Invalid Login 2')) }

 //  create token
 const payload = { id: foundUser.id }
 const token = jwt.sign(payload, process.env.JWT_SECRET, {
   algorithm: 'HS256',
   expiresIn: '15d'
 })

  //  rip password, createdAt, updatedAt
 const { password, createdAt, updatedAt, ...userData } = foundUser

	res.json({
		msg: 'Login controller',
		token: token,
		user: userData,
	})
}