docker compose -p event-saver down;
docker compose -p event-saver -f docker-compose.yaml -f docker-compose.prod.yaml pull;
docker compose -p event-saver -f docker-compose.yaml -f docker-compose.prod.yaml up -d --remove-orphans;
