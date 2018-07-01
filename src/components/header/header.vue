<template>
  <header id="header">
    <div class="logo">
      <router-link to="/">Vue - Complete Guide</router-link>
    </div>
    <nav>
      <ul>
        <li v-if="!auth">
          <router-link to="/signup">Sign Up</router-link>
        </li>
        <li v-if="!auth">
          <router-link to="/signin">Sign In</router-link>
        </li>
        <li v-if="auth">
          <router-link to="/dashboard">Dashboard</router-link>
        </li>
        <li v-if="auth">
          <button class="logout" @click="logout">Logout</button>
        </li>
      </ul>
    </nav>
  </header>
</template>
<script>
  export default {
    computed: {
      auth () {
        return this.$store.getters.isAuthenticated;
      }
    },
    methods: {
      logout () {
        this.$store.dispatch('signOut');
      }
    }
  }
</script>
<style scoped>
  #header {
    height: 56px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    background-color: #521751;
    padding: 0 20px;
  }

  .logo {
    font-weight: bold;
    color: white;
  }

  .logo a {
    text-decoration: none;
    color: white;
  }

  nav {
    height: 100%;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    height: 100%;
    display: flex;
    flex-flow: row;
    align-items: center;
  }

  li {
    margin: 0 16px;
  }

  li a {
    text-decoration: none;
    color: white;
  }

  li a:hover,
  li a:active,
  li .router-link-active {
    color: #fa923f;
  }
  
  .logout {
    color: white;
    background-color: transparent;
    border: none;
    font-size: inherit;
    cursor: pointer;
  }
</style>