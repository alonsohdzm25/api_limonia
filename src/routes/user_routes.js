import { Router } from "express";
const router = Router()

import * as userCtrl from '../controllers/user_controller'
import { authJwt, verifySignUp } from '../middlewares'

router.post('/', [
    authJwt.verifyToken,
    authJwt.isAdmin,
    verifySignUp.checkRolesExisted
], userCtrl.createUser)

router.get('/',[
    authJwt.verifyToken,
    authJwt.isAdmin,
    verifySignUp.checkRolesExisted
], userCtrl.getUsers)

router.get('/:token', userCtrl.getUser)

router.put('/:token', userCtrl.updateUser)

router.delete('/:token', userCtrl.deleteUser)

export default router;