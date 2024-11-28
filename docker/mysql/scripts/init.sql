CREATE DATABASE IF NOT EXISTS `testing`;
CREATE DATABASE IF NOT EXISTS `kitchen`;
CREATE DATABASE IF NOT EXISTS `testing_kitchen`;

GRANT ALL PRIVILEGES ON `testing`.* TO 'app'@'%';
GRANT ALL PRIVILEGES ON `kitchen`.* TO 'app'@'%';
GRANT ALL PRIVILEGES ON `testing_kitchen`.* TO 'app'@'%';