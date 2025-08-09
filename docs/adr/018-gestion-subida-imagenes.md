# ADR: Gestión de subida de imágenes en el backend

# Razones para no usar el sistema de archivos local en Vercel

Vercel utiliza funciones serverless para ejecutar el backend. Cada vez que se atiende una petición, se crea un entorno temporal y efímero: cualquier archivo guardado en el sistema de archivos local se elimina al finalizar la ejecución. Por tanto, no es posible almacenar imágenes de forma persistente en el sistema de archivos local de Vercel.

## Contexto

Actualmente, el backend (BO) no permite la subida ni gestión de imágenes. Al crear un recurso como un libro (book), solo se almacena el nombre del archivo de la imagen de portada, y la subida real se realiza desde el frontend. Esto limita la trazabilidad, validación y control sobre los archivos subidos.

## Decisión

Se implementará un endpoint en el backend para gestionar la subida de imágenes. El flujo será el siguiente:

1. **Subida desde el frontend:** El usuario selecciona una imagen y el frontend la envía al backend mediante una petición HTTP (por ejemplo, `POST /api/uploads`).
2. **Almacenamiento:** El backend almacena la imagen en un sistema de archivos local, almacenamiento en la nube (ej. S3) o similar, y devuelve la URL o identificador del archivo subido.
3. **Referencia en el modelo:** Al crear o actualizar un recurso (ej. un libro), se almacena la URL o identificador de la imagen en el campo correspondiente del modelo.
4. **Acceso:** El frontend utiliza la URL proporcionada por el backend para mostrar la imagen.

## Alternativas consideradas

- Seguir subiendo imágenes solo desde el frontend y almacenar solo el nombre del archivo: se descarta por falta de control y trazabilidad.
- Subir imágenes directamente a un bucket público desde el frontend: requiere exponer credenciales o lógica adicional de seguridad.

## Consecuencias

- Mayor control y validación de archivos subidos.
- Posibilidad de aplicar restricciones de tamaño, tipo y seguridad desde el backend.
- Mejor trazabilidad y gestión de recursos multimedia.

## Próximos pasos

- Definir el endpoint de subida de archivos en el backend.
- Implementar almacenamiento local o integración con un proveedor externo (ej. S3).
- Actualizar el frontend para usar el nuevo flujo de subida.

## Opciones de almacenamiento compatibles y gratuitas

Como el backend está desplegado en Vercel, no es posible almacenar archivos de forma persistente en el sistema de archivos local, ya que Vercel es serverless y el almacenamiento local es efímero. Por tanto, se recomienda utilizar servicios externos gratuitos:

- **Cloudinary**: Permite almacenar y servir imágenes de forma gratuita con un plan básico. Proporciona API para subida directa desde el backend o frontend y gestión de URLs optimizadas.
- **Imgur**: Ofrece una API gratuita para subir imágenes, aunque con limitaciones de uso y sin control total sobre la privacidad.
- **Supabase Storage**: Si ya se usa Supabase, su módulo de Storage permite almacenar archivos de forma gratuita hasta cierto límite (ver detalles más abajo).
- **Amazon S3 (Free Tier)**: AWS ofrece un nivel gratuito limitado durante 12 meses, útil para pruebas o proyectos pequeños.

**Recomendación:** Para este proyecto, se recomienda utilizar Supabase Storage como opción principal, ya que la base de datos ya está en Supabase y permite una integración sencilla y centralizada.

## Límites de Supabase Storage (plan gratuito)

- 2 GB de almacenamiento total.
- 1 GB de transferencia mensual.
- 50.000 archivos.
- Límite de tamaño por archivo: 50 MB.
- El rendimiento y la disponibilidad pueden ser menores que en planes de pago.

Estos límites pueden cambiar, por lo que se recomienda consultar la documentación oficial de Supabase para detalles actualizados.

## Ejemplo de implementación (Cloudinary)

## Ejemplo de implementación (Supabase Storage)

1. Crear un bucket en Supabase Storage desde el panel de Supabase.
2. Obtener la URL del proyecto y la clave de servicio (service_role) desde la configuración de Supabase.
3. Instalar el SDK de Supabase en el backend (`npm install @supabase/supabase-js`).
4. Crear un endpoint en el backend que reciba el archivo (por ejemplo, usando `multer` para procesar el `multipart/form-data`).
5. Subir la imagen al bucket de Supabase Storage y devolver la URL pública al frontend.

### Ejemplo de código (Node.js/Express)

```js
const { createClient } = require('@supabase/supabase-js')
const multer = require('multer')
const express = require('express')
const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/api/uploads', upload.single('image'), async (req, res) => {
  try {
    const { data, error } = await supabase.storage
      .from('nombre-del-bucket')
      .upload(
        `imagenes/${Date.now()}-${req.file.originalname}`,
        req.file.buffer,
        {
          contentType: req.file.mimetype,
          upsert: false,
        },
      )
    if (error) return res.status(500).json({ error })
    // Obtener la URL pública
    const { publicURL } = supabase.storage
      .from('nombre-del-bucket')
      .getPublicUrl(data.path)
    res.json({ url: publicURL })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
```

> Cambia `nombre-del-bucket` por el nombre real de tu bucket en Supabase.

## Consideraciones específicas para Supabase

- Asegúrate de configurar las políticas de acceso público/privado según tus necesidades.
- No expongas la clave `service_role` en el frontend, solo debe usarse en el backend.

1. Crear una cuenta gratuita en Cloudinary y obtener las credenciales de API.
2. Instalar el SDK de Cloudinary en el backend (`npm install cloudinary`).
3. Crear un endpoint en el backend que reciba el archivo (por ejemplo, usando `multer` para procesar el `multipart/form-data`).
4. Subir la imagen a Cloudinary desde el backend y devolver la URL pública al frontend.

### Ejemplo de código (Node.js/Express)

```js
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const express = require('express')
const router = express.Router()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/api/uploads', upload.single('image'), async (req, res) => {
  try {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) return res.status(500).json({ error })
        res.json({ url: result.secure_url })
      },
    )
    stream.end(req.file.buffer)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
```

## Consideraciones

- No almacenar imágenes en el sistema de archivos local en Vercel.
- Usar servicios externos gratuitos para almacenamiento persistente.
- Validar tamaño y tipo de archivo en el backend antes de subir.
