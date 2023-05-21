:: script for windows
:: use with "up.bat committext" 
git pull
git add .
git commit -m "%*"
git push