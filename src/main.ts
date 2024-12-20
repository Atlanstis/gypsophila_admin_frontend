import { createApp } from 'vue';

import { setupAssets } from './assets';
import { setupStore } from './stores';
import { setupRouter } from './router';
import { setupNaive } from './plugins';

import App from './App.vue';

async function setupApp() {
  setupAssets();

  const app = createApp(App);

  setupStore(app);

  setupNaive();

  await setupRouter(app);

  app.mount('#app');
}

setupApp();
