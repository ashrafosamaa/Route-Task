import db_connection from "../DB/connection.js"

import { globalResponse } from "./middlewares/global-response.middleware.js"

import cors from 'cors'

import * as routers from "./modules/index.routes.js"

export const initiateApp = (app, express)=> {
    const port = process.env.PORT

    app.use(cors())

    app.use(express.json())

    db_connection()

    app.use('/userAuth', routers.userAuthRouter)
    app.use('/user', routers.userRouter)
    app.use('/categories', routers.categoryRouter)
    app.use('/task', routers.taskRouter)

    app.get('/', (req, res, next)=> {
        res.send("<h1> Welcome In Route App </h1>");
    })

    app.all('*', (req, res, next)=> {
        return next(new Error('Page not found', { cause: 404 }))
    })

    app.use(globalResponse)

    app.listen(port, ()=> console.log(`server is running on host`))
}