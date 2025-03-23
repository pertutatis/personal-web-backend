#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Leer los archivos
const paths1 = require('../docs/api/openapi-paths.json');
const paths2 = require('../docs/api/openapi-paths2.json');
const schemas1 = require('../docs/api/openapi-schemas1.json');
const schemas2 = require('../docs/api/openapi-schemas2.json');
const schemas3 = require('../docs/api/openapi-schemas3.json');

// Combinar los paths
const paths = {
  ...paths1.paths,
  ...paths2.paths
};

// Combinar los schemas
const components = {
  schemas: {
    ...schemas1.components.schemas,
    ...schemas2.components.schemas
  },
  ...schemas3.components
};

// Crear el documento OpenAPI completo
const openapi = {
  openapi: "3.0.3",
  info: paths1.info,
  servers: paths1.servers,
  paths,
  components
};

// Guardar el archivo combinado
fs.writeFileSync(
  path.join(__dirname, '../docs/api/openapi.json'),
  JSON.stringify(openapi, null, 2)
);
