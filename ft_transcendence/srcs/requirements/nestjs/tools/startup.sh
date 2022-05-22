if [ "$ENVIRONMENT" == "dev" ]; then
  echo development mode!
  npm run start:dev
elif [ "$ENVIRONMENT" == "prod" ]; then
  echo production mode!
  npm run start:prod
fi