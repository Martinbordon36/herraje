# Etapa 1: Construir la aplicación
FROM node:22.4.1-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de dependencias y instalarlas
COPY package.json package-lock.json ./
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:stable-alpine

# Copiar los archivos construidos a Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
