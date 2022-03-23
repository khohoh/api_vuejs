require('./bootstrap');

import { createApp } from 'vue';

const app = createApp({});

app.component('articles', require('./components/Articles.vue').default);
app.component('navbar', require('./components/Navbar.vue').default);

app.mount('#app');
