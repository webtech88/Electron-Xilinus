#/usr/env bash
ABSPATH=$(cd "$(dirname "$0")"; pwd)

# Get current version
VERSION=`grep version src/electron/package.json | cut -d'"' -f 4`

# Ask for new version
echo "Current version: $VERSION"
read -p "New version: " NEWVERSION
echo $NEWVERSION

# Update version in src/electron/package.json
sed -i.bak s/$VERSION/$NEWVERSION/g src/electron/package.json

# Build all distrib (Mac/Windows/Linux)
export CSC_KEY_PASSWORD="atrisktech"
export CSC_LINK=$ABSPATH/devIDAppCertificate.p12

npm run clean
npm run release:all

# Copy them to server
rm -f release.zip
zip -r release.zip release/*
scp -r release.zip ydadmin@10.12.181.215:docker/data
ssh ydadmin@10.12.181.215 "cd docker/data; rm -rf release; unzip release.zip; rm -rf InvictusCollect/release; mv release InvictusCollect"

echo "You need to commit/push src/electron/package.json with the new version number"
read -p "Do you want to do it now? (Y/n) " COMMIT
if  [ "$COMMIT" = "Y" -o "$COMMIT" = "y" -o -z "$COMMIT" ]
then
  git add src/electron/package.json
  git commit -m "Update version to $NEWVERSION"
  git push
fi
