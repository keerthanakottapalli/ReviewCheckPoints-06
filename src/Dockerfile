FROM nginx
WORKDIR /usr/share/nginx/html
COPY build .
EXPOSE 85
CMD ["nginx","-g","daemon off;"]