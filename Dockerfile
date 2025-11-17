# Dùng image Nginx chính thức
FROM nginx:alpine

# Copy toàn bộ file HTML/CSS vào thư mục Nginx
COPY . /usr/share/nginx/html

# Nginx mặc định chạy trên port 80
EXPOSE 80
