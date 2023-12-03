import express from 'express';
import consentsRoutes from '../routes/consentsRoutes.js';
import Consent from '../models/postgres-consent.js';
import ConsentType from '../models/postgres-consentType.js';

const {
    getConsents,
    getConsent,
    getUserConsents,
    createConsent,
    updateConsent,
    addConsentType,
    removeConsentType,
} = consentsRoutes(Consent, ConsentType);

const router = express.Router();

router.get('/', getConsents);
router.get('/:id', getConsent);
router.get('/user/:userId', getUserConsents);
router.post('/', createConsent);
router.put('/:id', updateConsent);
router.put('/:id/addConsentType', addConsentType);
router.put('/:id/removeConsentType', removeConsentType);

export default router;