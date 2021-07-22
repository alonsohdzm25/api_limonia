import { Router } from "express";
const router = Router()

import * as plagasCtrl from '../controllers/plagas_controller'
import { authJwt } from '../middlewares'

router.get('/', plagasCtrl.getPlagas)
//router.get('/:plagasId', plagasCtrl.getPlagasById)
router.get('/:name', plagasCtrl.getPlagasByName)

router.post('/', [authJwt.verifyToken, authJwt.isAdmin], function(req,res) { plagasCtrl.createPlagas })

router.put('/:plagasId', [authJwt.verifyToken, authJwt.isAdmin], plagasCtrl.updatePlagasById)

router.delete('/:plagasId', [authJwt.verifyToken, authJwt.isAdmin], plagasCtrl.deletePlagasById)

export default router;