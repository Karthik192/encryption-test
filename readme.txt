Authentication

Level - 1:
User login
If we look the documents in the database, password is viewed as plaintext.

Level - 2:
Database encryption
If hecker gets into app.js he can get the secret string and can use the key
to decrypt the message.

Level - 3:
Using environmental variables
If uploading to remote - gitignore .env file
If pushed to heroku - you need to access configure variables


