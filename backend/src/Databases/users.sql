 CREATE TABLE users(user_id VARCHAR(100) NOT NULL,username VARCHAR(100)UNIQUE,email VARCHAR(200) UNIQUE,password VARCHAR(200),Role VARCHAR(100) DEFAULT 'user', assigned VARCHAR(50) DEFAULT 0
 CONSTRAINT
 PK_users
 PRIMARY KEY(user_id)
 
 )


CREATE PROCEDURE insertUsers(@user_id VARCHAR(100), @username VARCHAR(100), @email VARCHAR(100), @password VARCHAR(200))
AS
BEGIN
INSERT INTO users(user_id,username,email,password) VALUES (@user_id,@username,@email,@password)

END



 SELECT * FROM users


CREATE PROCEDURE insertSingleUser( @user_id VARCHAR(100),@username VARCHAR(100), @email VARCHAR(200), @password VARCHAR(200))
AS
BEGIN

INSERT INTO users(user_id,username,email,password) VALUES(@user_id,@username, @email, @password)

END


SELECT * FROM project


CREATE PROCEDURE getUser(@email VARCHAR(200))
AS
BEGIN
SELECT * FROM users WHERE email =@email
END


UPDATE  users 

SET Role='Admin' WHERE user_id= '89e4334b-f452-4df0-a40b-9e3afd01d2aa'