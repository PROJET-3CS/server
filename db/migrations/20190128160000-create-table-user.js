const sql =
  "CREATE TABLE IF NOT EXISTS `Users` (`id` INTEGER NOT NULL auto_increment UNIQUE , `firstname` VARCHAR(255), `lastname` VARCHAR(255), `email` VARCHAR(255) UNIQUE, `password` VARCHAR(255), `gender` ENUM('male', 'female'), `birthDay` DATETIME, `birthPlace` VARCHAR(255), `adress` VARCHAR(255), `phone` INTEGER, `avaialable` TINYINT(1), `speciality` VARCHAR(255), `typePatient` VARCHAR(255), `status` ENUM('pending', 'archived', 'actif') DEFAULT 'pending', `role` INTEGER, `age` INTEGER, `token` VARCHAR(255), `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;";
module.exports = {
  up: (queryInterface) => queryInterface.sequelize.query(sql),
  down: () => {},
};