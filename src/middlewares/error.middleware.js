import { z, ZodError } from "zod"

export default (err,req,res,next) => {
   if(err instanceof ZodError) {
       return res.status(400).json({
           success: false,
           errors: z.flattenError(err).fieldErrors
          //  errors: err.issues
          //  errors: err.issues.map(err => err.message)
       })
   }
   res.status(err.status || 500)
   res.json({
       status : err.status || 500,
       message : err.message || 'Server Error!!'
   })
}
