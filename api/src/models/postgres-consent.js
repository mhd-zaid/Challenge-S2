import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize-config.js";
import User from "./postgres-user.js";
class Consent extends Model {}

Consent.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        consent: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Field 'consent' cannot be empty.",
                },
            },
        },
    },
    {
        sequelize,
        timestamps: true,
        modelName: "Consent",
    }
);

Consent.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

User.hasMany(Consent, {
    foreignKey: "userId",
    as: "consents",
});

export default Consent;