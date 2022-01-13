Authentication

Level - 1:
User login
If we look the documents in the database, password is viewed as plaintext.

Level - 2:
Database encryption
If hecker gets into app.js he can get the secret string and can use the key
to decrypt the message.

Using environmental variables
If uploading to remote - gitignore .env file
If pushed to heroku - you need to access configure variables

Level - 3:
Hashing
Hashing done at registering and login and compare hash values
MD5 hashing is easy for common passwords and so hecker can heck
So strong - unique and long password

Level - 4:
Hashing and Salting
Perfect security with SaltingRounds

Level - 5:
Cookies and sessions
Save data temp in browser and authenticate

Level - 6:
Third party OAuth - Open Authorization