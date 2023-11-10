import { ObjectId } from "mongodb";

const categoriesFixture = [
    {
        "id": new ObjectId().toString(),
        "name": "Chaussures de sport",
        "description": "Chaussures de sport pour hommes, femmes"
    },
    {
        "id": new ObjectId().toString(),
        "name": "Chaussures de ville",
        "description": "Chaussures de ville pour hommes, femmes"
    },
    {
        "id": new ObjectId().toString(),
        "name": "Chaussures de randonnée",
        "description": "Chaussures de randonnée pour hommes, femmes"
    },
    {
        "id": new ObjectId().toString(),
        "name": "Sandales",
        "description": "Sandales pour hommes, femmes"
    },
    {
        "id": new ObjectId().toString(),
        "name": "Tongs",
        "description": "Tongs pour hommes, femmes"
    },
];

export default categoriesFixture;