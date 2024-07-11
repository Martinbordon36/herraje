#!/bin/bash

# Definición de función para imprimir rectángulo
print_rectangle() {
    local text="$1"
    local text_length=${#text}
    local line=""
    for (( i=0; i<text_length+8; i++ )); do
        line="${line}="
    done
    echo ""
    echo "|| $line ||"
    echo "||   $text   ||"
    echo "|| $line ||"
}



# Genera un nombre de imagen basado en la fecha y hora actual
IMAGE_TAG="$(date +'%Y%m%d-%H%M%S')"
export IMAGE_TAG

# Construcción de la imagen Docker
print_rectangle "Construcción de la Imagen Docker"
docker build -t frontend-herrajes-almada:$IMAGE_TAG .

# Mensaje final con rectángulo
print_rectangle "Imagen Docker creada exitosamente"
echo "================================================"
echo ""
echo ""
echo ""
print_rectangle "Imagen Docker creada exitosamente con tag: $IMAGE_TAG"
echo "-"
echo "-"
# Iniciar sesión en Docker Hub
print_rectangle "Inicio de sesión en Docker Hub"
echo "-"
echo "-"
# Aquí usaremos --password-stdin para evitar el almacenamiento de contraseña en texto plano
echo "123Edllcrc123.-" | docker login -u eriiclette@gmail.com --password-stdin
echo "-"
echo "-"
print_rectangle "Etiquetando imagen para Docker Hub"
docker tag frontend-herrajes-almada:$IMAGE_TAG eriiclette/frontend-herrajes-almada:$IMAGE_TAG
echo "-"
echo "-"
print_rectangle "Empujando imagen a Docker Hub"
docker push eriiclette/frontend-herrajes-almada:$IMAGE_TAG

echo "-"
echo "-"
print_rectangle "Levantando proyecto con docker-compose up de la imagen: $IMAGE_TAG"
echo "-"
echo "-"

echo "-"
echo "-"
print_rectangle "Realizando la conexion SSH para levantar imagen en produccion: $IMAGE_TAG"
echo "-"
echo "-"

# Realizar la conexión SSH y modificar el archivo docker-compose.yml
sshpass -p "t8eEdJNbEh62" ssh root@vps-1915951-x.dattaweb.com -p 5334 << EOF
    # Acceder al directorio /home/herraje_almada/app
    cd /home/herraje_almada/front

    # Crear variables de entorno.
    # source env.sh


    # Modificar el archivo docker-compose.yml
    sed -i 's|image: eriiclette/frontend-herrajes-almada:.*|image: eriiclette/frontend-herrajes-almada:$IMAGE_TAG|' docker-compose.yml

    # Reiniciar los contenedores con el nuevo docker-compose.yml
    docker-compose down
    docker-compose up -d
EOF
