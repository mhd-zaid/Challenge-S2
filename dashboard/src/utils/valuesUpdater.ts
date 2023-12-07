export const columnNames: any = {
  firstname: 'Prénom',
  lastname: 'Nom',
  email: 'Email',
  name: 'Nom',
  description: 'Description',
  gender: 'Genre',
  createdAt: 'Date de création',
  role: 'Rôle',
  disabled: 'Statut',
  id: 'ID',
  passwordUpdatedAt: 'Date de modification du mot de passe',
  passwordResetToken: 'Token de réinitialisation du mot de passe',
  birthdate: 'Date de naissance',
  address: 'Adresse',
  postalCode: 'Code postal',
  city: 'Ville',
  phone: 'Téléphone',
  loginAttempts: 'Nombre de tentatives de connexion',
  blockedAt: 'Date de blocage',
  isValidate: 'E-mail confirmé',
  authentificationToken: "Token d'authentification",
  updatedAt: 'Date de modification',
  price: 'Prix',
  vat: 'TVA',
  quantity: 'Qté',
  size: 'Taille',
  color: 'Couleur',
  status: 'Statut',
  userId: 'ID utilisateur',
  deliveryAddress: 'Adresse de livraison',
  products: 'Produits',
  user: 'ID utilisateur',
  sku: 'SKU',
  discount: 'Réduction',
  alertQuantity: 'Qté. avant alerte',
  deletedAt: 'Date de suppression',
  modelId: 'ID modèle',
  productImage: 'Image',
  productImages: 'Images',
  model: 'Modèle',
  models: 'Modèles',
  payment: "ID paiement",
}
const Host = import.meta.env.VITE_HOST_API
export const formatDate = (date: string) => {
  const dateObject = new Date(date)
  const year = dateObject.getFullYear()
  const month = String(dateObject.getMonth() + 1).padStart(2, '0')
  const day = String(dateObject.getDate()).padStart(2, '0')
  const hours = String(dateObject.getHours()).padStart(2, '0')
  const minutes = String(dateObject.getMinutes()).padStart(2, '0')
  const seconds = String(dateObject.getSeconds()).padStart(2, '0')

  return `${day}/${month}/${year} à ${hours}:${minutes}:${seconds}`
}

const getImages = (productImages: any) => {
  if (!productImages || productImages.length === 0) {
    return ''
  }

  return productImages.map((productImage: any) => {
    return `${Host}/images/${productImage.url}`
  })
}

const getFirstImage = (productImages: any) => {
  if (!productImages || productImages.length === 0) {
    return ''
  }

  return `${Host}/images/${productImages[0].url}`
}

const getModel = (model: any) => {
  if (!model) {
    return ''
  }

  return `${model.name} ${model.gender}`
}

const getModels = (models: any) => {
  const modelsName = []
  for (const model of models) {
    modelsName.push(model.name)
  }
  return modelsName.join(', ')
}

export const getEntityName = (entity: string) => {
  const entityNames: any = {
    user: 'Utilisateur',
    product: 'Produit',
    order: 'Commande',
    brand: 'Marque',
    category: 'Catégorie',
    model: 'Modèle',
    users: 'Utilisateurs',
    products: 'Produits',
    orders: 'Commandes',
    brands: 'Marques',
    categories: 'Catégories',
    models: 'Modèles',
  }

  return entityNames[entity]
}

export const getValue = (row: any, col: any) => {
  const valueMappings: any = {
    role: {
      ROLE_ADMIN: 'Administrateur',
      ROLE_STORE_KEEPER: 'Magasinier',
      ROLE_USER: 'Utilisateur'
    },
    disabled: {
      true: 'Inactif',
      false: 'Actif'
    },
    gender: {
      male: 'Homme',
      female: 'Femme'
    },
    isValidate: {
      true: 'Oui',
      false: 'Non'
    },
    status: {
      'payment pending': 'En attente',
      paid: 'Payée',
      processing: 'En cours',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    },
    discount: {
      null: 'Aucune'
    },
    color: {
      white: 'Blanc',
      black: 'Noir',
      red: 'Rouge',
      blue: 'Bleu',
      green: 'Vert',
      yellow: 'Jaune',
      pink: 'Rose',
      purple: 'Violet',
      brown: 'Marron',
      grey: 'Gris',
      orange: 'Orange',
      beige: 'Beige',
      Pink: 'Rose',
      Purple: 'Violet',
      Blue: 'Bleu',
      Black: 'Noir',
      Green: 'Vert',
      Red: 'Rouge',
      White: 'Blanc',
      Brown: 'Marron',
      Grey: 'Gris',
      Yellow: 'Jaune',
    }
  }

  if (col in valueMappings) {
    const mapping = valueMappings[col]
    return mapping[row[col]] || row[col]
  }

  const dateColumns = [
    'date',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'birthdate',
    'passwordUpdatedAt'
  ]

  if (dateColumns.includes(col)) {
    return formatDate(row[col])
  }

  if (col === 'user') {
    return row[col].id
  }

  if (col === 'productImages') {
    return getImages(row[col])
  }

  if (col === 'productImage') {
    return getFirstImage(row['productImages'])
  }

  if (col === 'model') {
    return getModel(row[col])
  }

  if (col === 'models') {
    return getModels(row[col])
  }

  return row[col]
}