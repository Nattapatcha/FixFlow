FROM php:8.2-fpm

# ติดตั้ง System Dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev

# ติดตั้ง PHP Extensions (สำหรับ MySQL และ PostgreSQL)
RUN docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd

# ติดตั้ง Composer (หัวใจของ PHP Developer)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# กำหนด Working Directory
WORKDIR /var/www/html

# แก้ปัญหา Permission บน Linux/Docker (สำคัญมาก!)
RUN chown -R www-data:www-data /var/www/html