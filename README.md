# Proyecto Final Angular - Ecommerce

Este es el proyecto frontend desarrollado en Angular para el sistema de Ecommerce.

## Prerrequisitos

- **Node.js**: Se requiere tener instalado Node.js (versión LTS recomendada).
- **pnpm**: Este proyecto utiliza `pnpm` como gestor de paquetes. Si no lo tienes, instálalo con:
  ```bash
  npm install -g pnpm
  ```
- **Angular CLI**: Se recomienda tener instalada la CLI de Angular globalmente:
  ```bash
  npm install -g @angular/cli
  ```

## Instalación

Sigue estos pasos detallados para instalar el proyecto:

1. **Crear Carpeta**: Crea una nueva carpeta en tu computadora donde quieras alojar el proyecto, por ejemplo, llámala `Proyecto Frontend`.
2. **Abrir Terminal**: Abre la carpeta que acabas de crear y abre una terminal dentro de ella.
3. **Clonar Repositorio**: Ejecuta el comando `git clone` con la URL del repositorio.
   ```bash
   git clone https://github.com/AlejandroLeon2/Proyecto-final-Angular.git
   ```
4. **Abrir en IDE**: Navega hacia la carpeta del proyecto clonado y ábrelo con tu editor de código favorito.
   ```bash
   cd Proyecto-final-Angular
   code .
   ```
   *(El comando `code .` funciona si tienes Visual Studio Code instalado y configurado en el PATH)*

5. **Instalar Dependencias**: Estando dentro del editor (VS Code), abre una nueva terminal integrada y ejecuta:
   ```bash
   pnpm install
   ```

## Configuración del Entorno

1. **Variables de Entorno**:
   - Localizar el archivo `.example.env` en la raíz del proyecto.
   - Crear una copia de este archivo y renombrarla a `.env`.
   - **Importante**: Rellenar las variables en el archivo `.env` con tus propias credenciales de Firebase (API Key, Auth Domain, etc.) y la URL de la API.

2. **Generación de Archivos de Entorno**:
   - El proyecto utiliza un script para generar los archivos `environment.ts` y `environment.development.ts` automáticamente basándose en tu archivo `.env`.
   - Este paso se ejecuta automáticamente al iniciar el servidor, pero también puedes ejecutarlo manualmente con:
     ```bash
     pnpm run config
     ```

## Ejecución

- **Modo Desarrollo**:
  Ejecuta el siguiente comando para levantar el servidor y abrir el navegador automáticamente:
  ```bash
  ng serve -o
  ```
  El servidor se iniciará en `http://localhost:4200`.

- **Modo Producción**:
  Para generar los archivos optimizados para despliegue en la carpeta `dist/`, ejecuta:
  ```bash
  ng build --configuration=production
  ```

- **Pruebas**:
  Para correr las pruebas unitarias, ejecuta:
  ```bash
  pnpm test
  ```
