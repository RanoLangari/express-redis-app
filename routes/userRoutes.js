import { loginMahasiswa, registerMahasiswa} from "../controller/userController.js";
import express from 'express'

const router = express.Router()

router.post('/login', loginMahasiswa)
router.post('/register', registerMahasiswa)

export default router

