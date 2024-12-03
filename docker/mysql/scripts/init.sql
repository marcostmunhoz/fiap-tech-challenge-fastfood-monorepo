CREATE DATABASE IF NOT EXISTS `testing`;
CREATE DATABASE IF NOT EXISTS `kitchen`;
CREATE DATABASE IF NOT EXISTS `testing_kitchen`;
CREATE DATABASE IF NOT EXISTS `order`;
CREATE DATABASE IF NOT EXISTS `testing_order`;

GRANT ALL PRIVILEGES ON `testing`.* TO 'app'@'%';
GRANT ALL PRIVILEGES ON `kitchen`.* TO 'app'@'%';
GRANT ALL PRIVILEGES ON `testing_kitchen`.* TO 'app'@'%';
GRANT ALL PRIVILEGES ON `order`.* TO 'app'@'%';
GRANT ALL PRIVILEGES ON `testing_order`.* TO 'app'@'%';