mkdir -p ../wot-src-data;
chown -R 1000:1000 ../wot-src-data;
rm ../wot-src-data/.git/index.lock;

docker compose -p prod down;
docker compose -p prod -f docker-compose.yaml -f docker-compose.prod.yaml pull;
docker compose -p prod -f docker-compose.yaml -f docker-compose.prod.yaml up -d --remove-orphans;
