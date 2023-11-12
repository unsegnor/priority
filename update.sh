#!/bin/bash

git fetch
git reset --hard
git pull

# Load nvm. NVM_PATH variable must be defined in the environment or before running (eg. export NVM_PATH="/home/pi/.config/nvm")
export NVM_DIR="$NVM_PATH"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm install
nvm use
nvm alias default "$(cat .nvmrc)"

npm i
