import fs from 'node:fs/promises';
import path from 'node:path';

export async function POST({ request }) {
  try {
    const formData = await request.formData();

    const newProperty = {
      id: Date.now(),
      titulo: formData.get('titulo'),
      ubicacion: formData.get('ubicacion'),
      tipoOperacion: formData.get('tipoOperacion'),
      areaTerreno: parseFloat(formData.get('areaTerreno')),
      tipoVivienda: formData.get('tipoVivienda'),
      descripcion: formData.get('descripcion'),
      caracteristicas: formData.get('caracteristicas') || '',
      imagenes: JSON.parse(formData.get('imagenes') || '[]'),
    };

    const propertiesFilePath = path.resolve(process.cwd(), 'src/data/properties.json');

    let properties = [];
    try {
      const fileContent = await fs.readFile(propertiesFilePath, 'utf-8');
      properties = JSON.parse(fileContent);
    } catch (readError) {
      if (readError.code === 'ENOENT') {
        console.log('properties.json not found, creating a new one.');
      } else {
        throw readError; // Re-throw other read errors
      }
    }

    properties.push(newProperty);

    await fs.writeFile(propertiesFilePath, JSON.stringify(properties, null, 2), 'utf-8');

    // Redirect after successful submission
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/propiedades', // Redirect to a success page or the properties listing
      },
    });
  } catch (error) {
    console.error('Failed to add property:', error);
    return new Response(JSON.stringify({ message: 'Failed to add property.', error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 