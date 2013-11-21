#!/bin/sh
echo "Creating necessary folders..."
mkdir ./static
mkdir ./views
mkdir ./models
mkdir ./routes
mkdir ./test

echo "Copying code, markup and CSS boilerplate..."
cp ./templates/app/app.js ./app.js
cp ./templates/app/package.json ./package.json
cp ./templates/app/.gitignore ./.gitignore
cp ./templates/app/config.json ./config.json
cp ./templates/app/Makefile ./Makefile
cp ./templates/models/user.js ./models/user.js
cp ./templates/routes/route.js ./routes/route.js
cp ./templates/routes/pass-local.js ./routes/pass-local.js
cp ./templates/routes/mailer.js ./routes/mailer.js
cp ./templates/test/stub.js ./test/stub.js
cp -r ./templates/static/* ./static/
cp ./templates/views/*.jade ./views/

echo "Setting up dependencies from NPM..."
npm install

echo "Removing stuff you don't want..."
rm -rf .git
rm -rf templates
rm README.md
rm initproject.sh
rm initproject.bat

echo "Initializing new git project..."
git init
git add .
git commit -m"Initial Commit"
