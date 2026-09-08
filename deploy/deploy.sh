
set -euo pipefail

cd /opt/schedule-app


git fetch --prune origin
git reset --hard origin/main


unset NODE_ENV

npm ci


set -a; . ./.env.production; set +a

npx prisma migrate deploy
npm run build


cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

sudo systemctl restart schedule-app


sleep 3
curl -fsS http://localhost:3000/api/health
echo