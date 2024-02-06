docker buildx build --platform=linux/amd64 -f Dockerfile.prod -t okp980/wemeet-backend .

docker push okp980/wemeet-backend   

docker run -p 3000:3000 --env-file ./.env.production --rm --name wemeets okp980/wemeet-backend