import { Router , Request, Response} from "express";
import { acceptOrder, acceptOrderr, acceptOrderrr, createOrder, declineorder, deleteOrder, getallOrders, getOrderById, getSellerOrders, getShippedOrders, getTransformateurOrders, productsinorders } from "../controllers/orderController";
import {auth} from "../middleware/auth";


const router = Router();


router.post('/create', auth, createOrder);

// Liste commandes du vendeur
router.get('/mine',auth, getSellerOrders);
router.get('/minee',auth, getTransformateurOrders);

router.get('/all',getallOrders);
router.get('/shipped',getShippedOrders);
router.put('/:id/accept', async (req, res) => {
  try {
    const updatedOrder = await acceptOrder(req.params.id);
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id/acceptt', async (req, res) => {
  try {
    const updatedOrder = await acceptOrderr(req.params.id);
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id/accepttt', async (req, res) => {
  try {
    const updatedOrder = await acceptOrderrr(req.params.id);
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});




router.put('/:id/decline', async (req, res) => {
  try {
    const updatedOrder = await declineorder(req.params.id);
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/productsinorders",auth, productsinorders);

router.delete("/delete/:id", deleteOrder);

router.get("/:id", getOrderById);




export default router ; 