<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue';
import { useTitleStore } from './stores/title'
const title = useTitleStore();
import {useAccountStore } from './stores/account';
import router from '@/router';
import Background from "@/components/icons/Background.vue";

const account = useAccountStore();
const logout = () =>{
  localStorage.removeItem('token');
  account.notLogin();
  router.push('/about')
}

function getImgUrl(pet: any) {

    return '../public/' + pet + ".png"
  }
</script>

<template>
  <Background/>
  <div style="margin-top: 100px; margin-bottom: 100px ; width: 1300px; z-index: 1">

    <div>
      <div style="margin-top: 80px; top: 0; left: 0; position: fixed; margin-left: 30px">
        <div>
          <a type="text" target="_blank" href="https://www.facebook.com/duriu.team"><img class="logo" src="../public/facebook.png" style="margin-right: 10px;"/></a>
        </div>
        <div>
          <a type="text" target="_blank"><img class="logo" src="../public/insta.png" style="margin-right: 10px;"/></a>
        </div>
        <div>
          <a type="text" target="_blank" href="https://www.tiktok.com/@duriu.team"><img class="logo" src="../public/tiktok.png" style="margin-right: 10px;"/></a>
        </div>
        <div>
          <a type="text" target="_blank"><img class="logo" src="../public/twitter.png" style="margin-right: 10px;"/></a>
        </div>
      </div>

      <header>
        <img alt="Vue logo" class="logo" :src='getImgUrl(title.reactImg)' width="125" height="125" />

        <div class="wrapper">
          <div>
            <HelloWorld :msg="title.title" />
          </div>
          <nav v-if='!account.isLogin'>
            <RouterLink to="/about">About</RouterLink>
            <RouterLink to="/login">Login</RouterLink>
            <RouterLink to="/register">Register</RouterLink>
          </nav>
          <nav v-else>
<!--            <RouterLink to="/about">About</RouterLink>-->
            <RouterLink to="/main">Main</RouterLink>
            <RouterLink to="/setting">Setting</RouterLink>
            <a @click="logout()">Logout</a>
          </nav>
        </div>
      </header>
    </div>
    <div style="margin-top: 50px">
      <RouterView />

    </div>
  </div>

</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 1000vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
