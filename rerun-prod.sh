docker compose -p event-saver down;
docker compose -p event-saver -f docker-compose.yaml pull;
docker compose -p event-saver -f docker-compose.yaml up --build -d --remove-orphans;
