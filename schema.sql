USE hapitest;

DROP TABLE IF EXISTS `organizations`;
CREATE TABLE `organizations` (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  description VARCHAR(255),
  url VARCHAR(255),
  code SMALLINT UNSIGNED,
  type ENUM('employer', 'insurance', 'health-system')
);
