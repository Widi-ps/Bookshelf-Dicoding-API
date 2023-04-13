/* eslint-disable import/no-extraneous-dependencies */
const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
  });

  await server.start();
  console.log(`Server ini berjalan pada ${server.info.uri}`);
};

init();
