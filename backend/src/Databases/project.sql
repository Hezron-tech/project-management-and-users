
-- //project queries

CREATE PROCEDURE insertProject(@id VARCHAR(100),@name VARCHAR(100),@description VARCHAR(200),@date VARCHAR(50),@user_id VARCHAR(50))
AS
BEGIN
INSERT INTO project(id,name,description,date,user_id) VALUES(@id,@name,@description,@date,@user_id)

END

--all projects
CREATE PROCEDURE allProjects
AS
BEGIN
SELECT * FROM project
END


--sigle project
CREATE PROCEDURE singleProject(@id VARCHAR(100))
AS
BEGIN
SELECT * FROM Project WHERE id =@id
END

--update project
CREATE PROCEDURE updateProject(@id VARCHAR(100) , @name VARCHAR(100) , @description VARCHAR(200),@date VARCHAR(50))
AS
BEGIN 
UPDATE project SET id=@id , name=@name , description=@description, date=@date WHERE id =@id

END
--delete project
CREATE PROCEDURE deleteProject(@id VARCHAR(100))
AS
BEGIN
DELETE FROM project WHERE id =@id
END


--assigning project to user

CREATE OR ALTER PROCEDURE getAssignedEmails (
    @userId VARCHAR(100)
)
AS
BEGIN
    SELECT u.email, u.username
    from users u INNER JOIN project p
    ON u.user_id = p.user_id AND u.user_id = @userId 
end