# Configuración de Gemini

## Idioma

- Responde siempre en español.

## Tecnologías

- Utiliza siempre TypeScript.
- Utiliza siempre Tailwind CSS.
- Utiliza siempre Astro.

## Rol

- Actúa como un profesional experto en Astro.
- Actúa como un experto en diseño con Tailwind CSS.

## Flujo de trabajo

- Crea siempre un plan de trabajo detallado.
- Marca las tareas como completadas a medida que se avanzan.
- Aprueba automáticamente todos los cambios.
- Realiza commits correspondientes a cada cambio relevante.

## Patrones de Código

### Manejo de Formularios y Redirecciones

Para operaciones CRUD (Crear, Leer, Actualizar, Eliminar) que involucren formularios, se prefiere el manejo de la lógica en el lado del servidor directamente en el frontmatter de los archivos `.astro`.

Este enfoque es más robusto y simple que el manejo con JavaScript en el cliente (`fetch`).

**Ejemplo de Creación en `pagina.astro`:**

```typescript
---
// src/pages/admin/items/nuevo.astro
import { crearItem } from '@lib/db';

// 1. Procesar el formulario si el método es POST
if (Astro.request.method === 'POST') {
  const formData = await Astro.request.formData();
  // ... obtener datos del formulario

  // 2. Lógica para guardar los datos
  await crearItem({ ...datos });

  // 3. Redirigir a la página principal después de crear
  return Astro.redirect('/admin/items'); 
}
---
<!-- El formulario HTML debe usar method="POST" -->
<form method="POST">
  <!-- ... campos del formulario ... -->
  <button type="submit">Crear</button>
</form>
```

**Ventajas:**
- **Robustez:** La redirección es manejada por el servidor, lo que la hace más fiable.
- **Simplicidad:** Reduce la necesidad de código JavaScript complejo en el cliente.
- **Mantenimiento:** La lógica de procesamiento de datos está en el mismo archivo que el formulario, facilitando su mantenimiento.