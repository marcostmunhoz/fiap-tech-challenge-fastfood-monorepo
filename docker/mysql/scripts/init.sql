CREATE DATABASE IF NOT EXISTS `auth`;
CREATE DATABASE IF NOT EXISTS `kitchen`;
CREATE DATABASE IF NOT EXISTS `testing_kitchen`;
CREATE DATABASE IF NOT EXISTS `order`;
CREATE DATABASE IF NOT EXISTS `testing_order`;

GRANT ALL PRIVILEGES ON `auth`.* TO 'app'@'%';
GRANT ALL PRIVILEGES ON `kitchen`.* TO 'app'@'%';
GRANT ALL PRIVILEGES ON `testing_kitchen`.* TO 'app'@'%';
GRANT ALL PRIVILEGES ON `order`.* TO 'app'@'%';
GRANT ALL PRIVILEGES ON `testing_order`.* TO 'app'@'%';

CREATE TABLE `auth`.`customers` (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NULL,
    email VARCHAR(255) NULL,
    cpf VARCHAR(11) NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT customers_pk_index PRIMARY KEY (id)
)