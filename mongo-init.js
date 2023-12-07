db.createUser(
    {
        user: "root",
        pwd: "challenge-s2",
        roles: [
            {
                role: "readWrite",
                db: "challenge-s2"
            }
        ]
    }
);