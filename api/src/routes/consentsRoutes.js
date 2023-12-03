export default (Consent, ConsentType) => ({
    getConsents: async (req, res) => {
        try {
            const consents = await Consent.findAll({
                include : ["consentTypes", "user"]
            });
            if (consents.length === 0) {
                res.status(404).json({ message: "No consents found" });
            }
            res.status(200).json(consents);
        } catch (error) {
            res.status(500).json({
                message: `An error occurred while retrieving the consents : ${error.message}`,
            });
        }
    },

    getConsent: async (req, res) => {
        try {
            const { id } = req.params;
            const consent = await Consent.findOne({ 
                where: { id }, 
                include : ["consentTypes", "user"]
            });

            res.status(200).json(consent);
        } catch (error) {
            res.status(500).json({
                message: `An error occurred while retrieving the consent : ${error.message}`,
            });
        }
    },

    getUserConsents: async (req, res) => {
        try {
            const { userId } = req.params;
            const consents = await Consent.findAll({ 
                where: { userId },
                include : ["consentTypes", "user"]
             });
            if (consents.length === 0) {
                return res.status(404).json({ message: "No User consents found" });
            }
            res.status(200).json(consents);
        } catch (error) {
            res.status(500).json({
                message: `An error occurred while retrieving the consents : ${error.message}`,
            });
        }
    },

    createConsent: async (req, res) => {
        try {
            if (!req.body.consent === undefined) {
                return res.status(400).json({ message: "Consent parameter is missing" });
            }

            if (!req.body.consentTypes) {
                return res.status(400).json({ message: "Consent types parameter is missing" });
            }

            if (!req.body.userId) {
                return res.status(400).json({ message: "User parameter is missing" });
            }

            const consent = await Consent.create({
                consent: req.body.consent,
                userId: req.body.userId,
            });

            req.body.consentTypes.forEach(async (consentType) => {
                const isConsentType = await ConsentType.findOne({ where: { id: consentType.id } });
                if (!isConsentType) {
                    return res.status(400).json({ message: "Consent type not found" });
                }
                await consent.addConsentType(consentType.id);
            });    

            res.status(201).json(consent);
        } catch (error) {
            if (error.name == "SequelizeValidationError") {
                res.status(422).json({
                    message: `An error occurred while creating the consent : ${error.message}`,
                });
            } else {
                res.status(500).json({
                    message: `An error occurred while creating the consent : ${error.message}`,
                });
            }
        }
    },

    updateConsent: async (req, res) => {
        try {
            const { id } = req.params;
            const consentDataToUpdate = req.body;

            if (!id) {
                return res.status(400).json({ message: "id parameter is missing" });
            }

            if (!consentDataToUpdate.consent) {
                return res.status(400).json({ message: "Consent parameter is missing" });
            }

            const consent = await Consent.findOne({ where: { id } });

            if (!consent) {
                return res.status(404).json({ message: "Consent not found" });
            }

            await consent.update(consentDataToUpdate);

            res.status(200).json(consent);
        } catch (error) {
            if (error.name == "SequelizeValidationError") {
                res.status(422).json({
                    message: `An error occurred while updating the consent : ${error.message}`,
                });
            } else {
                res.status(500).json({
                    message: `An error occurred while updating the consent : ${error.message}`,
                });
            }
        }
    },

    addConsentType: async (req, res) => {
        try {
            const { id } = req.params;
            const { consentTypeId } = req.body;

            if (!id) {
                return res.status(400).json({ message: "id parameter is missing" });
            }

            if (!consentTypeId) {
                return res.status(400).json({ message: "Consent type id parameter is missing" });
            }

            const consent = await Consent.findOne({ where: { id } });

            if (!consent) {
                return res.status(404).json({ message: "Consent not found" });
            }

            const consentType = await ConsentType.findOne({ where: { id: consentTypeId } });

            if (!consentType) {
                return res.status(404).json({ message: "Consent type not found" });
            }

            await consent.addConsentType(consentTypeId);

            res.status(200).json({ message: "Consent type added successfully" });
        } catch (error) {
            if (error.name == "SequelizeValidationError") {
                res.status(422).json({
                    message: `An error occurred while adding the consent type : ${error.message}`,
                });
            } else {
                res.status(500).json({
                    message: `An error occurred while adding the consent type : ${error.message}`,
                });
            }
        }
    },

    removeConsentType: async (req, res) => {
        try {
            const { id } = req.params;
            const { consentTypeId } = req.body;

            if (!id) {
                return res.status(400).json({ message: "id parameter is missing" });
            }

            if (!consentTypeId) {
                return res.status(400).json({ message: "Consent type id parameter is missing" });
            }

            const consent = await Consent.findOne({ where: { id } });

            if (!consent) {
                return res.status(404).json({ message: "Consent not found" });
            }

            const consentType = await ConsentType.findOne({ where: { id: consentTypeId } });

            if (!consentType) {
                return res.status(404).json({ message: "Consent type not found" });
            }

            await consent.removeConsentType(consentTypeId);

            res.status(200).json({ message: "Consent type removed successfully" });
        } catch (error) {
            if (error.name == "SequelizeValidationError") {
                res.status(422).json({
                    message: `An error occurred while removing the consent type : ${error.message}`,
                });
            } else {
                res.status(500).json({
                    message: `An error occurred while removing the consent type : ${error.message}`,
                });
            }
        }
    },
});