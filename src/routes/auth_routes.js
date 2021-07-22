import { Router } from "express";
const router = Router()

import * as authCtrl from '../controllers/auth_controller'
import { verifySignUp } from '../middlewares'

router.use((req, res,next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    )
    next()
})

router.post(
    '/signup',
    [ verifySignUp.checkDuplicatedUsernameOrEmail, verifySignUp.checkRolesExisted ],
    authCtrl.signUp)
    
router.post('/signin', authCtrl.signIn)

router.get('/confirm/:token',
            [],
            authCtrl.confirm
)

router.post('/recoverypassword', authCtrl.repairPassword)
router.post('/resendemail',authCtrl.resendEmail)
router.get('/recoverypassword/:token', (req, res) => {
    res.send(`
    <body>
        <h1>Este proceso solo se puede realizar desde la app</h1>
    </body>
    <style>
        h1 {
            text-align: center;
        }
    </style>
    `)
})
export default router;