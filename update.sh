git fetch
git reset --hard
git pull

# Use nvm environment variables
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install
nvm use
nvm alias default "$(cat .nvmrc)"

npm i
