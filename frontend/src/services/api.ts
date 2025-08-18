import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL || 'https://agritrace.azizarfaoui.ip-ddns.com/api';

// Configure axios with default headers
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export enum Role {
  FARMER = 'Farmer',
  TRANSPORTER = 'Transporter',
  STOCK_MANAGER = 'StockManager',
  ADMIN = 'Admin',
}
export interface EnvironmentalData {
  nom:string;
  waterUsage: number;
  co2Emission: number;
}
export interface Parcel {
  _id: string;
  nom:string;
  parcelLocation: string;
  area: number;
  culture:string;
  traitement:string;
  produit:string;
}


export interface CreateParcelData {
  nom:string;
  parcelLocation: string;
  area: number;
  culture:string;
  traitement:string;

}

export interface Variety   {
  name: string;
  diseaseResistance: string;
}


interface RegisterData {
  nom: string;
  email: string;
  password: string;
  role: Role;
  telephone: string;

}

export enum ProductionMethod {
  ORGANIC = 'Organic',
  CONVENTIONAL = 'Conventional',
  BIODYNAMIC = 'Biodynamic',
}


export interface CreateCultureData {
  nom:string;
  variete:string;
  datePlantation: Date;
  dateRecolte: Date;
  typeIrrigation: string;
}


export interface CreateProduitData {
  libelle:string;
  quantite: number;
  parcel:string;
  qrCode: string;
  etat:string;

}


interface Farmer {
  nom: string;
  email:string;
  // autres propriétés si besoin
}
interface Transporter {
  nom: string;
  email:string;
  // autres propriétés si besoin
}
type orderData = {
  deliveryDate: Date;
  farmer: Farmer;
  transporter: string | Transporter;
  products: CreateProduitData[];
  status: string;
  
};



export interface createFeedback {
  commentaire: string,
  date: Date,  
}


export interface createReclamation {
  description:string,
  date: Date, 
}

export interface CreateTraitementData {
  nomPesticide: string;
  quantitePesticide: number;
  waterUsage: number;
}





export const api = {
  // Environmental Data
  getEnvironmentalData: async (): Promise<EnvironmentalData[]> => {
    const response = await axios.get(`${API_URL}/environment`);
    return response.data;
  },

  getStorageConditions: async (): Promise<EnvironmentalData[]> => {
    const response = await axios.get(`${API_URL}/storage-conditions`);
    return response.data;
  },


  getTransportConditions: async (): Promise<EnvironmentalData[]> => {
    const response = await axios.get(`${API_URL}/transport-conditions`);
    return response.data;
  },
  
  createEnvironmentalData: async (data: EnvironmentalData) => {
    const response = await axios.post(`${API_URL}/environment/create`, data);
    return response.data;
  },


  createParcel: async (data: CreateParcelData) => {
    const response = await axios.post(`${API_URL}/parcel/create`, data);
    return response.data;
  },

  getParcelById: async (parcelId: string): Promise<Parcel[]> => {
    const response = await axios.get(`${API_URL}/parcel/${parcelId}`);
    return response.data;
  },

  // Parcels
  getParcels: async (): Promise<Parcel[]> => {
    const response = await axios.get(`${API_URL}/parcel/`);
    return response.data;
  },

  


 createVariety : async (data: FormData) => {
  return await axios.post('https://agritrace.azizarfaoui.ip-ddns.com/api/varieties/create', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
},



  getVarieties: async (): Promise<Variety[]> => {
    const response = await axios.get(`${API_URL}/varieties/`);
    return response.data;
  },

  getUsersByRole: async (role: string) => {
    try {
      const response = await axios.get(`${API_URL}/admin/userbyrole/${role}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs par rôle:', error);
      throw new Error('Erreur lors de la récupération des utilisateurs.');
    }
  },
  
  updateUserById: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/admin/updateuser/${id}`, data);
    return response.data;
  },
  
  deleteUserById: async (id: string) => {
    const response = await axios.delete(`${API_URL}/admin/deleteuser/${id}`);
    return response.data;
  },

  createUser: async (userData: any) => {
  const response = await axios.post(`${API_URL}/admin/createuser`, userData);
  return response.data;
},

  
  // Authentication
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

    register:  (data: RegisterData) => {
    return axios.post(`${API_URL}/auth/register`, data);
  },

  
   getLotByName : async (name: string) => {
  const res = await axios.get(`${API_URL}/lot/name/${name}`);
  return res.data;
},



 fetchMyParcels : async (token: string) => {
  const response = await axios.get(`${API_URL}/parcel/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
},
fetchMyVarietys : async (token: string) => {
  const response = await axios.get(`${API_URL}/varieties/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
},

fetchMyProducts : async (token: string) => {
  const response = await axios.get(`${API_URL}/produits/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
},

fetchMyCultures : async (token: string) => {
  const response = await axios.get(`${API_URL}/cultures/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
},
fetchMyTraitements : async (token: string) => {
  const response = await axios.get(`${API_URL}/traitements/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
},

 getProducts: async (): Promise<CreateProduitData[]> => {
    const response = await axios.get(`${API_URL}/produits/`);
    return response.data;
  },
  
   getLotById : async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/lot/${id}`);
      return response.data; // Le retour contient le lot et l'image du QR code
    } catch (error) {
      console.error('Erreur lors de la récupération du lot par ID', error);
      throw error;
    }
  },

   getProduitById: async (produitId: string)=> {
    try {
    const response = await axios.get(`${API_URL}/produits/${produitId}`);
   return response.data; // Le retour contient le lot et l'image du QR code
    }catch (error) {
      console.error('Erreur lors de la récupération du lot par ID', error);
      throw error;
    }
  },
  
  getLots: async (): Promise<Parcel[]> => {
    const response = await axios.get(`${API_URL}/lot/getalllots`);
    return response.data;
  },


   getLotByHash : async (hash: string) => {
    try {
      const response = await axios.get(`${API_URL}/lot/hash/${hash}`);
      return response.data; // Le retour contient le lot
    } catch (error) {
      console.error('Erreur lors de la récupération du lot par hash', error);
      throw error;
    }
  },

createCulture: async (data: CreateCultureData) => {
    const response = await axios.post(`${API_URL}/cultures/create`, data);
    return response.data;
  },

  getCultureById: async (cultureId: string): Promise<CreateCultureData[]> => {
    const response = await axios.get(`${API_URL}/cultures/${cultureId}`);
    return response.data;
  },

  // Parcels
  getCultures: async (): Promise<CreateCultureData[]> => {
    const response = await axios.get(`${API_URL}/cultures/`);
    return response.data;
  },





 /* createProduit: async (data: CreateProduitData) => {
    const response = await axios.post(`${API_URL}/produits/create`, data);
    return response.data;
  },*/

  createProduit : async (data: FormData) => {
  return await axios.post('https://agritrace.azizarfaoui.ip-ddns.com/api/produits/create', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
},

 

  // Produits
  getproduits: async (): Promise<CreateProduitData[]> => {
    const response = await axios.get(`${API_URL}/produits/`);
    return response.data;
  },



  createTraitement: async (data: CreateTraitementData) => {
    const response = await axios.post(`${API_URL}/traitements/create`, data);
    return response.data;
  },

  getTraitementById: async (traitementId: string): Promise<CreateTraitementData[]> => {
    const response = await axios.get(`${API_URL}/traitements/${traitementId}`);
    return response.data;
  },

  // Parcels
  gettraitements: async (): Promise<CreateTraitementData[]> => {
    const response = await axios.get(`${API_URL}/traitements/`);
    return response.data;
  },

  createOrder: async (data: orderData) => {
    const response = await axios.post(`${API_URL}/order/create`, data);
    return response.data;
  },

   getorders: async (): Promise<orderData[]> => {
    const response = await axios.get(`${API_URL}/order/`);
    return response.data;
  },


 
   getAllZones : async () => {
const response = await axios.get(`${API_URL}/zones/`);
    return response.data;},

 createZone : async (zoneData: any) => {
const response = await axios.post(`${API_URL}/zones/create`, zoneData);
    return response.data;},

updateZone : async (id: string, zoneData: any) => {
  return axios.put(`${API_URL}/zones/update/${id}`, zoneData);
},

 deleteZone :async (id: string) => {
  return axios.delete(`${API_URL}/zone/delete/${id}`);
},



 getAllStocks : async () => {
const response = await axios.get(`${API_URL}/stocks/`);
    return response.data;},

    getStockZoneA : async () => {
const response = await axios.get(`${API_URL}/stocks/zone/zone A`);
    return response.data;},

    getStockZoneB : async () => {
const response = await axios.get(`${API_URL}/stocks/zone/zone B`);
    return response.data;},

    getStockZoneC : async () => {
const response = await axios.get(`${API_URL}/stocks/zone/zone C`);
    return response.data;},



 createStock : async (zoneData: any) => {
const response = await axios.post(`${API_URL}/stocks/create`, zoneData);
    return response.data;},

updateStock : async (id: string, zoneData: any) => {
  return axios.put(`${API_URL}/stocks/update/${id}`, zoneData);
},

 deleteStock :async (id: string) => {
  return axios.delete(`${API_URL}/stocks/delete/${id}`);
},
//for responsable de stockage
 acceptOrder : async (orderId: string) : Promise<void> => {
  try {
    await axios.put(`https://agritrace.azizarfaoui.ip-ddns.com/api/order/${orderId}/accept`);
    //fetchOrders(); // Recharge les commandes après mise à jour
  } catch (error) {
    console.error('Erreur lors de l’acceptation de la commande', error);
  }
},
//for vendeur
acceptOrderr : async (orderId: string) : Promise<void> => {
  try {
    await axios.put(`https://agritrace.azizarfaoui.ip-ddns.com/api/order/${orderId}/accepttt`);
    //fetchOrders(); // Recharge les commandes après mise à jour
  } catch (error) {
    console.error('Erreur lors de l’acceptation de la commande', error);
  }
},


getAllReclam : async () => {
const response = await axios.get(`${API_URL}/reclamations/all`);
    return response.data;},

 createReclamation : async (createReclamation: any) => {
const response = await axios.post(`${API_URL}/reclamations/create`, createReclamation);
    return response.data;},

    deleteReclamation :async (id: string) => {
  return axios.delete(`${API_URL}/reclamations/delete/${id}`);
},



    getAllFeedback : async () => {
const response = await axios.get(`${API_URL}/feedbacks/all`);
    return response.data;},

 createFeedback : async (createFeedback: any) => {
const response = await axios.post(`${API_URL}/feedbacks/create`, createFeedback);
    return response.data;},

  deleteFeedback :async (id: string) => {
  return axios.delete(`${API_URL}/feedbacks/delete/${id}`);
},

 updateProduitConformite : async (produitId: string, conformite: string) => {
  return axios.put(`${API_URL}/produits/${produitId}/conformite`, { conformite });
}
,

updateProduitCarbone : async (produitId: string, CO2emission: string) => {
  return axios.put(`${API_URL}/produits/${produitId}/carbone`, { CO2emission });
}
,

saveMessage: async (message: {
  userId: string;
  role: "user" | "assistant";
  content: string;
}): Promise<any> => {
  const response = await axios.post(`${API_URL}/chat/messages`, message, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // si token utilisé
    },
  });
  return response.data;
},

getMessages: async (userId: string): Promise<any[]> => {
  const response = await axios.get(`${API_URL}/chat/messages/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // si token utilisé
    },
  });
  return response.data;
},



   
}; 