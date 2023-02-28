FROM nginx:alpine
COPY ./build /usr/share/nginx/html
ADD ./nginx.conf /etc/nginx/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]