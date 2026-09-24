# Sistema-de-Gesti-n-Autolote-

Guía Completa de Instalación y Ejecución

Sigue estos pasos para clonar y poner en marcha el sistema completo del Autolote (Frontend en Angular con Tailwind CSS v4, Backend en Node.js con Express, y Base de Datos en MySQL) en tu entorno local.

Requisitos Previos

Asegúrate de tener instalado en tu computadora:

Node.js (versión 18 o superior recomendada).

Angular CLI (npm install -g @angular/cli).

MySQL o un entorno local como XAMPP / WampServer.



1. Clonar el Repositorio

Abre tu terminal y clona el proyecto, asegurándote de cambiar a la rama de desarrollo correspondiente (feature):

git clone https://github.com/Nicollezz/Sistema-de-Gesti-n-Autolote-.git
cd Sistema-de-Gesti-n-Autolote-
git checkout feature




2. Configuración y Ejecución del Backend

Navega a la carpeta del backend:

cd backend


Instala las dependencias necesarias:

npm install





Crea un archivo .env en la raíz de la carpeta backend con las credenciales de tu base de datos MySQL:

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=autolote_db
JWT_SECRET=tu_clave_secreta


Inicia el servidor del backend:

node app.js


(Deberás ver en la consola el mensaje: Servidor corriendo en http://localhost:3000).





3. Configuración del Frontend (Angular con Tailwind CSS v4)

Abre otra pestaña o ventana de la terminal y dirígete a la carpeta del frontend (o raíz del proyecto Angular).

Instala las dependencias del proyecto:

npm install



Configuración de Tailwind CSS v4 (si se requiere integrar de cero):

Instala los paquetes oficiales de Tailwind v4 y PostCSS:

npm install tailwindcss @tailwindcss/postcss postcss


Crea un archivo llamado .postcssrc.json en la raíz del proyecto frontend con el siguiente contenido:

{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}


Agrega la directiva de importación de Tailwind v4 en tu archivo de estilos globales (src/styles.css):

@import "tailwindcss";





Inicia la aplicación de Angular:

ng serve




Abre el navegador web de preferencia e ingresa a:

http://localhost:4200