import { Router } from "express";
const router = Router()

import * as productCtrl from '../controllers/productController'

router.get('/', productCtrl.getProducts)

router.get('/:comercialName', productCtrl.getProductByName)

export default router