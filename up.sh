# script for mac and linux
# use with "up.sh committext" 
# in case if error "command not found": 
# give grant permission with "chmod +x up.sh"
# and add PATH Variable export PATH=$PATH:/Pfad/zum/Verzeichnis

git pull
git add .
git commit -m "$*"
git push