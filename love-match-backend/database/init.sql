CREATE DATABASE IF NOT EXISTS love_match;

USE love_match;

CREATE TABLE IF NOT EXISTS test_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  person1_name VARCHAR(50),
  person1_age INT,
  person1_gender VARCHAR(10),
  person1_occupation VARCHAR(50),
  person1_personality JSON,
  person1_hobbies JSON,
  person1_values VARCHAR(50),
  person2_name VARCHAR(50),
  person2_age INT,
  person2_gender VARCHAR(10),
  person2_occupation VARCHAR(50),
  person2_personality JSON,
  person2_hobbies JSON,
  person2_values VARCHAR(50),
  match_score INT,
  analysis TEXT,
  suggestions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 