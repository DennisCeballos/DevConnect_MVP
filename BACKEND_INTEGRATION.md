# Guía de Integración del Backend

Este documento describe cómo conectar el frontend de DevConnect con tu backend Node.js/Express.

## 🔧 Configuración del Frontend

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

Para producción, actualiza con tus URLs desplegadas:

```bash
VITE_API_URL=https://tu-api.com/api
VITE_SOCKET_URL=https://tu-socket.com
```

### 2. CORS en el Backend

Tu backend debe permitir peticiones desde el frontend:

```javascript
// Express example
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:8080', 'https://tu-frontend.com'],
  credentials: true
}));
```

## 📡 Endpoints REST Requeridos

### Autenticación

```
POST /api/auth/register
Body: { name, email, password, role }
Response: { token, user }

POST /api/auth/login
Body: { email, password }
Response: { token, user }

GET /api/users/me
Headers: Authorization: Bearer {token}
Response: { user }

PUT /api/users/me
Headers: Authorization: Bearer {token}
Body: { name?, bio?, skills?, university?, profileImageUrl? }
Response: { user }
```

### Proyectos

```
GET /api/projects
GET /api/projects?ownerId={userId}
Headers: Authorization: Bearer {token}
Response: [{ _id, ownerId, title, description, tags, images, createdAt }]

GET /api/projects/:id
Headers: Authorization: Bearer {token}
Response: { _id, ownerId, title, description, tags, images, createdAt }

POST /api/projects
Headers: Authorization: Bearer {token}
Body: { title, description, tags, images }
Response: { _id, ownerId, title, description, tags, images, createdAt }

PUT /api/projects/:id
Headers: Authorization: Bearer {token}
Body: { title?, description?, tags?, images? }
Response: { _id, ownerId, title, description, tags, images, createdAt }

DELETE /api/projects/:id
Headers: Authorization: Bearer {token}
Response: 204 No Content
```

### Contratos

```
GET /api/contracts
Headers: Authorization: Bearer {token}
Response: [{ _id, creatorId, projectId?, title, description, status, createdAt }]

GET /api/contracts/:id
Headers: Authorization: Bearer {token}
Response: { _id, creatorId, projectId?, title, description, status, createdAt }

POST /api/contracts
Headers: Authorization: Bearer {token}
Body: { title, description, status, projectId? }
Response: { _id, creatorId, projectId?, title, description, status, createdAt }

PUT /api/contracts/:id
Headers: Authorization: Bearer {token}
Body: { title?, description?, status? }
Response: { _id, creatorId, projectId?, title, description, status, createdAt }

DELETE /api/contracts/:id
Headers: Authorization: Bearer {token}
Response: 204 No Content
```

### Chat

```
GET /api/conversations
Headers: Authorization: Bearer {token}
Response: [{ _id, members, createdAt, lastMessage?, otherUser? }]

GET /api/conversations/:id/messages
Headers: Authorization: Bearer {token}
Response: [{ _id, conversationId, senderId, receiverId, content, createdAt }]
```

### Upload

```
POST /api/uploads/presigned-url
Headers: Authorization: Bearer {token}
Body: { fileName, fileType }
Response: { url, key }
```

## 🔌 WebSocket (Socket.IO)

### Eventos del Servidor

El backend debe implementar estos eventos:

```javascript
// Server-side example
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Autenticación con token
  const token = socket.handshake.auth.token;
  // Verifica el token y obtén el userId

  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('leave_conversation', (conversationId) => {
    socket.leave(conversationId);
  });

  socket.on('send_message', async (data) => {
    const { conversationId, content, receiverId } = data;
    
    // Guarda el mensaje en MongoDB
    const message = await Message.create({
      conversationId,
      senderId: userId,
      receiverId,
      content,
      createdAt: new Date()
    });

    // Emite a todos en la conversación
    io.to(conversationId).emit('message_received', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
```

## 🗄️ Estructura MongoDB

### Colección: users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, index),
  password: String (bcrypt hashed),
  role: String ("freelancer" | "empresa"),
  bio: String,
  skills: [String],
  university: String,
  profileImageUrl: String,
  createdAt: Date
}
```

### Colección: projects
```javascript
{
  _id: ObjectId,
  ownerId: ObjectId (ref: users),
  title: String,
  description: String,
  tags: [String],
  images: [String], // URLs del bucket
  createdAt: Date
}
```

### Colección: contracts
```javascript
{
  _id: ObjectId,
  creatorId: ObjectId (ref: users),
  projectId: ObjectId (ref: projects, opcional),
  title: String,
  description: String,
  status: String ("published" | "in_progress" | "completed"),
  createdAt: Date
}
```

### Colección: conversations
```javascript
{
  _id: ObjectId,
  members: [ObjectId], // Array de 2 userIds
  createdAt: Date
}

// Index compuesto para búsqueda eficiente
db.conversations.createIndex({ members: 1 })
```

### Colección: messages
```javascript
{
  _id: ObjectId,
  conversationId: ObjectId (ref: conversations),
  senderId: ObjectId (ref: users),
  receiverId: ObjectId (ref: users),
  content: String,
  relatedProjectId: ObjectId (ref: projects, opcional),
  relatedContractId: ObjectId (ref: contracts, opcional),
  createdAt: Date
}

// Indexes
db.messages.createIndex({ conversationId: 1, createdAt: -1 })
```

## 🔐 Autenticación JWT

### Generación del Token
```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

### Middleware de Autenticación
```javascript
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Por favor autentícate' });
  }
};

// Uso
app.get('/api/users/me', auth, async (req, res) => {
  res.json(req.user);
});
```

## 📦 Storage con Presigned URLs

### Ejemplo con AWS S3
```javascript
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

app.post('/api/uploads/presigned-url', auth, async (req, res) => {
  const { fileName, fileType } = req.body;
  const key = `${Date.now()}-${fileName}`;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Expires: 60, // 1 minuto
    ContentType: fileType,
  };

  const url = s3.getSignedUrl('putObject', params);

  res.json({
    url,
    key,
    finalUrl: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`
  });
});
```

## 🚀 Deployment

### Frontend (Lovable)
1. Configurar variables de entorno en Lovable
2. Click en "Publish" para desplegar

### Backend
Opciones recomendadas:
- **Railway**: `railway up`
- **Render**: Deploy desde GitHub
- **Heroku**: `git push heroku main`
- **AWS EC2/ECS**: Usar Docker

### MongoDB Atlas
1. Crear cluster en https://cloud.mongodb.com
2. Configurar Network Access (IP whitelist)
3. Crear usuario de base de datos
4. Obtener connection string
5. Agregar a variables de entorno del backend

## 🧪 Testing

Prueba la conexión frontend-backend:

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend (Lovable ya lo ejecuta)
# El preview estará en http://localhost:8080
```

## 📝 Notas Importantes

1. **Seguridad**: Nunca expongas el JWT_SECRET ni las credenciales de MongoDB
2. **CORS**: Configura correctamente los orígenes permitidos
3. **Rate Limiting**: Implementa rate limiting en producción
4. **Validación**: Valida todos los inputs con librerías como `joi` o `express-validator`
5. **Logs**: Usa `morgan` o similar para logging de requests
6. **Error Handling**: Implementa middleware global de manejo de errores

## 🐛 Troubleshooting

### Frontend no puede conectar al backend
- ✅ Verifica las URLs en `.env`
- ✅ Revisa que el backend esté corriendo
- ✅ Confirma configuración CORS
- ✅ Revisa la consola del navegador para errores

### WebSocket no conecta
- ✅ Verifica `VITE_SOCKET_URL`
- ✅ Asegura que Socket.IO esté correctamente instalado en el backend
- ✅ Revisa que el transporte WebSocket esté habilitado

### Token JWT inválido
- ✅ Verifica que el JWT_SECRET sea el mismo
- ✅ Confirma formato: `Authorization: Bearer {token}`
- ✅ Revisa expiración del token (24h por defecto)
