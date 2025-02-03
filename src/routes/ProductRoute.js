import Router from "express"
import Authmiddleware from "../middleware/Auth.js"
import{addProduct ,getAllProduct,getProduct,updateProduct,deleteProduct,ProductwithOrder} from '../controller/ProductController.js'
const productRoute = Router()
productRoute.post("/addProduct",Authmiddleware,addProduct)
productRoute.get("/getAllProduct",getAllProduct)
productRoute.get("/getProduct",getProduct)
productRoute.put("/updateProduct",Authmiddleware,updateProduct)
productRoute.delete("/deleteProduct",Authmiddleware,deleteProduct)
productRoute.get("/ProductwithOrder",ProductwithOrder)
export default  productRoute