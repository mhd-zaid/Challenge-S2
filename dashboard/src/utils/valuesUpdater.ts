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
  alerteQuantity: 'Qté. avant alerte',
  deletedAt: 'Date de suppression',
  modelId: 'ID modèle',
  productImage: 'Image',
  productImages: 'Images'
}

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
    return `http://localhost:3000/images/${productImage.url}`
  })
}

const getFirstImage = (productImages: any) => {
  if (!productImages || productImages.length === 0) {
    return ''
  }

  return `http://localhost:3000/images/${productImages[0].url}`
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
      yellow: 'Jaune'
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
  if (col in dateColumns) {
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

  return row[col]
}
