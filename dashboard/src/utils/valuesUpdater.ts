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
  updatedAt: 'Date de modification'
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
    }
  }

  if (col in valueMappings) {
    const mapping = valueMappings[col]
    return mapping[row[col]] || row[col]
  }

  if (
    col === 'createdAt' ||
    col === 'updatedAt' ||
    col === 'birthdate' ||
    col === 'passwordUpdatedAt'
  ) {
    return formatDate(row[col])
  }

  return row[col]
}
