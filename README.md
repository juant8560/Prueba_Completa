Sistema de Gestión de Órdenes (Fullstack)

Solución integral para la administración de clientes, productos y órdenes de compra, con arquitectura escalable y persistencia en la nube.

Tecnologías Utilizadas

Backend: Node.js con Express.
Frontend: React (Vite).
Base de Datos: Firebase Firestore (NoSQL).
Gestión de Estado y Rutas: React Router DOM y Hooks.

Instrucciones de Instalación
1. Clonar el repositorio

git clone [https://github.com/juant8560/Prueba_Completa.git]
cd Prueba_Completa

2. Configurar el Backend
cd order-management-api
npm install

3. Configurar el Frontend
cd ../order-management-frontend
npm install

Cómo Ejecutar
Iniciar Backend: Dentro de order-management-api, ejecuta: node src/server.js (Servidor en http://localhost:3000).

Iniciar Frontend: Dentro de order-management-frontend, ejecuta: npm run dev (App en http://localhost:5173).

Endpoints Disponibles
-Clientes: GET /api/clientes, POST /api/clientes (Valida ID único).
-Productos: GET /api/productos, POST /api/productos.
-Órdenes: GET /api/ordenes (Historial), POST /api/ordenes (Gestión de pedidos).

