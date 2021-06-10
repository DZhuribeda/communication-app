docker-compose exec keto keto namespace migrate up channels -c /etc/config/keto/keto.yml -y  
docker-compose exec messages npx prisma db push
