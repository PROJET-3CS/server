const sql = `
    INSERT IGNORE INTO Users(
        firstname,
        lastname,
        email,
        password,
        gender,
        birthday,
        birthplace,
        adress,
        status,
        role,
        age ) 
        VALUES(
        "Admin",
        "Admin", 
        "admin@admin.com", 
        "admin.clinity", 
        "male", 
        "11/11/11",
        "SBA", 
        "SBA",
        "actif",
        0,
        "30"
    );
`;

module.exports = {
    up: queryInterface => queryInterface.sequelize.query(sql),
    down: () => {},
};