import { createApp } from 'vue';

import { setupAssets } from './assets';
import { setupStore } from './stores';

import App from './App.vue';
import { setupRouter } from './router';

async function setupApp() {
  setupAssets();

  const app = createApp(App);

  setupStore(app);
  await setupRouter(app);

  app.mount('#app');
}

setupApp();
