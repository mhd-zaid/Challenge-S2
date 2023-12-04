import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize-config.js";
import Consent from "./postgres-consent.js";

class ConsentType extends Model {}

ConsentType.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Field 'name' cannot be empty.",
                },
            },
        },
        sendEmail: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Field 'sendEmail' cannot be empty.",
                },
            },
        },
    },
    {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: "ConsentType",
    }
);

Consent.belongsToMany(ConsentType, {
    foreignKey: "consentTypeId",
    as: "consentTypes",
    through: "Consents_ConsentTypes",
});

ConsentType.belongsToMany(Consent, {
    foreignKey: "consentId",
    as: "consents",
    through: "Consents_ConsentTypes",
});

export default ConsentType;