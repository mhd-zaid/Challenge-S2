export default (ConsentType) => ({
    getConsentTypes: async (req, res) => {
        try {
            const consentTypes = await ConsentType.findAll();
            
            res.status(200).json(consentTypes);
        } catch (error) {
            res.status(500).json({
                message: `An error occurred while retrieving the consent types : ${error.message}`,
            });
        }
    },

    getConsentType: async (req, res) => {
        try {
            const { id } = req.params;
            const consentType = await ConsentType.findOne({ where: { id } });
            if (!consentType) {
                return res.status(404).json({ message: "Consent type not found" });
            }
            res.status(200).json(consentType);
        } catch (error) {
            res.status(500).json({
                message: `An error occurred while retrieving the consent type : ${error.message}`,
            });
        }
    },

    createConsentType: async (req, res) => {
        try {
            if (!req.body.name) {
                return res.status(400).json({ message: "name parameter is missing" });
            }

            if (!req.body.sendEmail === undefined) {
                return res.status(400).json({ message: "sendEmail parameter is missing" });
            }

            const consentType = await ConsentType.create(req.body);

            res.status(201).json(consentType);
        } catch (error) {
            if (error.name == "SequelizeValidationError") {
                res.status(422).json({
                    message: `An error occurred while creating the consent type : ${error.message}`,
                });
            } else {
                res.status(500).json({
                    message: `An error occurred while creating the consent type : ${error.message}`,
                });
            }
        }
    },

    updateConsentType: async (req, res) => {
        try {
            const { id } = req.params;
            const consentTypeDataToUpdate = req.body;

            if (!id) {
                return res.status(400).json({ message: "Id parameter is missing" });
            }

            if (!consentTypeDataToUpdate.name) {
                return res.status(400).json({ message: "Name parameter is missing" });
            }

            if (!consentTypeDataToUpdate.sendEmail) {
                return res.status(400).json({ message: "Send email parameter is missing" });
            }

            const consentType = await ConsentType.findOne({ where: { id } });

            if (!consentType) return res.status(404).json({ message: "Consent type not found" });

            await consentType.update(consentTypeDataToUpdate);

            res.status(200).json({ message: "Consent type updated successfully" });
        } catch (error) {
            if (error.name == "SequelizeValidationError") {
                res.status(422).json({
                    message: `An error occurred while updating the consent type : ${error.message}`,
                });
            } else {
                res.status(500).json({
                    message: `An error occurred while updating the consent type : ${error.message}`,
                });
            }
        }
    },

    deleteConsentType: async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "Id parameter is missing" });
            }

            const consentType = await ConsentType.findOne({ where: { id } });

            if (!consentType) return res.status(404).json({ message: "Consent type not found" });

            await consentType.destroy();

            res.status(204).json({ message: "Consent type deleted successfully" });
        } catch (error) {
            res.status(500).json({
                message: `An error occurred while deleting the consent type : ${error.message}`,
            });
        }
    },
});