import { Request, Response } from 'express';
import Order,{OrderStatus} from '../models/Order';
import { AuthRequest } from '../middleware/auth';
import Produit,{etat} from '../models/Produit';

/*export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { deliveryDate, farmer, transporter, products } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }

    if (!deliveryDate || !farmer || !products || products) {
      res.status(400).json({ message: 'Champs requis manquants' });
      return;
    }

    // 🔄 Récupération du libelle pour chaque produit
    const fullProducts = await Promise.all(
      products.map(async (item: { product: string; quantite: number }) => {
        const produit = await Produit.findById(item.product);
        if (!produit) throw new Error(`Produit avec ID ${item.product} introuvable`);
        return {
          product: produit._id,
          quantite: item.quantite,
          libelle: produit.libelle, // ✅ auto-ajout
        };
      })
    );

    const order = await Order.create({
      deliveryDate,
      farmer,
      transporter,
      seller: userId,
      status: 'Pending',
      products: fullProducts,
    });

    res.status(201).json(order);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la création de la commande', error: err.message });
  }
};*/


export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { deliveryDate, transporter, products, farmer } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }

    // Vérification des champs
    if (!deliveryDate  || !farmer || !Array.isArray(products) || products.length === 0) {
      res.status(400).json({ message: 'Champs requis manquants ou liste de produits invalide' });
      return;
    }

    // Vérifie que tous les produits existent
    const validatedProductIds = await Promise.all(
  products.map(async (productObj: any) => {
    const productId = productObj.product; // ✅ extraire l'ID
    const produit = await Produit.findById(productId);
    if (!produit) {
      throw new Error(`Produit avec ID ${productId} introuvable`);
    }
    return produit._id;
  })
);


    // Création de la commande
    const order = await Order.create({
      deliveryDate,
      transporter,
      farmer,
      seller: userId,
      status: 'Enattente',
      products: validatedProductIds,
      transformateur:userId,
    });

    res.status(201).json(order);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la création de la commande', error: err.message });
  }
};



export const getSellerOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }

    const orders = await Order.find({ seller: userId })
      .populate({ path: 'farmer', model: 'User', select: 'email nom role' })
      .populate({ path: 'transporter', model: 'User', select: 'email nom role' })
      .populate({path: 'products' , select : 'libelle quantite '});

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
  }
};





  export const getallOrders = async (req: Request, res: Response): Promise<void> => {
  try {

    
const orders = await Order.find()
  .populate({ path: 'farmer', model: 'User', select: 'email nom role' })
  .populate({ path: 'transporter', model: 'User', select: 'email nom role' })
  .populate({path: 'products' , select : 'libelle quantite '})
  .populate({ path: 'seller', model: 'User', select: 'email nom role' });

 
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
  }
};



export const getTransformateurOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }

    const orders = await Order.find({ transformateur: userId })
     .populate({ path: 'farmer', model: 'User', select: 'email nom role' })
      .populate({ path: 'transporter', model: 'User', select: 'email nom role' })
      .populate({path: 'products' , select : 'libelle quantite '});

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
  }
};



//for responsablestockage
export const acceptOrder = async (idOrder: string) => {
  const order = await Order.findById(idOrder).populate('products');
  if (!order) throw new Error('Commande introuvable');

  order.status = OrderStatus.valide;

  for (const produit of order.products as any[]) {
    if (produit.etat === etat.DISPONIBLE) {
      produit.etat = etat.NONDISPONIBLE;
      await produit.save();
    }
  }

  await order.save();

  return order;
};

//for transporteur
export const acceptOrderr = async (idOrder: string) => {
  const order = await Order.findById(idOrder).populate('products');
  if (!order) throw new Error('Commande introuvable');

  order.status = OrderStatus.ENCOURSDELIVRAISON;

  for (const produit of order.products as any[]) {
    if (produit.etat === etat.DISPONIBLE) {
      produit.etat = etat.NONDISPONIBLE;
      await produit.save();
    }
  }

  await order.save();

  return order;
};
 //for seller & transformateur
export const acceptOrderrr = async (idOrder: string) => {
  const order = await Order.findById(idOrder).populate('products');
  if (!order) throw new Error('Commande introuvable');

  order.status = OrderStatus.DELIVERED;

  for (const produit of order.products as any[]) {
    if (produit.etat === etat.DISPONIBLE) {
      produit.etat = etat.NONDISPONIBLE;
      await produit.save();
    }
  }

  await order.save();

  return order;
};



//for responsable de stockage (reject)
export const declineorder = async (idOrder: string) => {
  const order = await Order.findById(idOrder).populate('products');
  if (!order) throw new Error('Commande introuvable');

  order.status = OrderStatus.REJECTED;

  for (const produit of order.products as any[]) {
    if (produit.etat === etat.DISPONIBLE) {
      produit.etat = etat.NONDISPONIBLE;
      await produit.save();
    }
  }

  await order.save();

  return order;
};


export const getShippedOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ status: OrderStatus.valide })
      .populate({ path: 'farmer', model: 'User', select: 'email nom role' })
      .populate({ path: 'seller', model: 'User', select: 'email nom role' })
      .populate({ path: 'products', select: 'libelle quantite' });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes expédiées' });
  }
};


export const productsinorders = async (req: AuthRequest, res: Response) => {
  try {
const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }

    const orders = await Order.find({
      status: "Livree",
      transformateur: userId,
    }).populate({
      path: "products",
      select: "libelle quantite",
    });

    const productsList: {
      _id: any;
      libelle: string;
      quantite: number;
      dateEntree: Date;
    }[] = [];

    orders.forEach((order) => {
      order.products.forEach((product: any) => {
        productsList.push({
          _id: product._id,
          libelle: product.libelle,
          quantite: product.quantite,
          dateEntree: order.deliveryDate,
        });
      });
    });

    res.status(200).json(productsList);
  } catch (error) {
    console.error("Erreur dans productsinorders:", error);
    res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des produits dans les commandes",
    });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

   const order = await Order.findById(id)
      .populate({ path: 'products', select: 'libelle quantite' })
  
  .populate({
    path: "farmer",
    model: "User", 
    select: "nom email",
  })
  .populate({
    path: "transporter",
    model: "User", 
    select: "nom email",
  });


    if (!order) {
      res.status(404).json({ error: "Commande non trouvée" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};