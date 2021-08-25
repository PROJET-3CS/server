const sql = `
    INSERT IGNORE INTO Users(
        firstname,
        lastname,
        email,
        password,
        gender,
        birdthday,
        birthplace,
        adress,
        status,
        role,
        age ) 
        VALUES(
        "Admin",
        "Admin", 
        "admin@admin.com", 
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2MjgxNzk5MTd9.ju1FcQhTz5YGg7Ie_S8Qwwv8KSf7noKh2Bdh2NSrtZM", 
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