import express from 'express'
import authController from '../controllers/auth.controller.js'
import categoriesController from '../controllers/categories.controller.js'
import questionsController from '../controllers/questions.controller.js'
import routesNames from './routes.names.js'
import path from 'path'
const __dirname = path.resolve();
const router = express.Router()

router.get(routesNames.getQuestions,questionsController.get_questions)
router.get(routesNames.getCategories,categoriesController.getCategories)
router.post(routesNames.createUserWithEmailAndPassword,authController.signUpWithEmail)
router.post(routesNames.signInWithEmail,authController.signInWithEmail)
router.put(routesNames.updateRefreshToken,authController.updateRefreshToken)
router.post(routesNames.requestRecoveryPassword,authController.requestResetPassword)
router.post(routesNames.setNewPassword,authController.setNewPassword)
router.get(routesNames.recoveryPassword,(req,res)=>{
    res.render("recovery", { titulo: "Nosotros EJS" });
})
export default router
