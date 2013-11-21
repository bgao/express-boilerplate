REM @echo off
echo "Creating necessary folders..."
mkdir .\static
mkdir .\views
mkdir .\models
mkdir .\routes
mkdir .\test

echo "Copying code, markup and CSS boilerplate..."
copy .\templates\app\app.js .\app.js
copy .\templates\app\package.json .\package.json
copy .\templates\app\.gitignore .\.gitignore
copy .\templates\app\config.json .\config.json
copy .\templates\app\Makefile .\Makefile
copy .\templates\models\user.js .\models\user.js
copy .\templates\routes\route.js .\routes\route.js
copy .\templates\routes\pass-local.js .\routes\pass-local.js
copy .\templates\routes\mailer.js .\routes\mailer.js
copy .\templates\test\stub.js .\test\stub.js
copy -r .\templates\static\* .\static\
copy .\templates\views\*.jade .\views\

echo "Setting up dependencies from NPM..."
npm install

echo "Removing stuff you don't want..."
del /S /F .git
del /S /F templates
del README.md
del initproject.sh
del initproject.bat

echo "Initializing new git project..."
git init
git add .
git commit -m"Initial Commit"
