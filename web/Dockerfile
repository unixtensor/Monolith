FROM guergeiro/pnpm AS builder

WORKDIR /app

COPY . .
RUN pnpm install && pnpm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN echo 'server { \
	listen 8000; \
	location /api/ { \
		proxy_pass http://server:3000; \
		proxy_set_header Host $host; \
		proxy_set_header X-Real-IP $remote_addr; \
	} \
	location / { \
		root /usr/share/nginx/html; \
		index index.html; \
		try_files $uri $uri/ /index.html; \
	} \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]
