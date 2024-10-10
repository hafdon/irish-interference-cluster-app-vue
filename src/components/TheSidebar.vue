<template>
  <nav class="sidebar">
    <h2 class="sidebar-title">My App</h2>
    <ul class="nav-list">
      <li>
        <router-link
          to="/"
          exact-active-class="active-link"
          active-class="active-link"
        >
          Word List
        </router-link>
      </li>
      <li>
        <router-link
          to="/word-add"
          exact-active-class="active-link"
          active-class="active-link"
        >
          Add a Word
        </router-link>
      </li>
      <li>
        <router-link
          to="/cluster"
          exact-active-class="active-link"
          active-class="active-link"
        >
          Cluster View
        </router-link>
      </li>
      <li>
        <router-link
          to="/cluster-catalog"
          exact-active-class="active-link"
          active-class="active-link"
        >
          Cluster Catalog
        </router-link>
      </li>
      <!-- Add more navigation links as needed -->
    </ul>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #2c3e50;
  color: white;
  height: 100vh; /* Full viewport height */
  position: fixed; /* Fixed sidebar */
  top: 0;
  left: 0;
  padding-top: 20px;
}

.sidebar-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.5em;
}

.nav-list {
  list-style-type: none;
  padding: 0;
}

.nav-list li {
  margin: 20px 0;
  text-align: center;
}

.nav-list a {
  color: white;
  text-decoration: none;
  font-size: 1.1em;
  display: block;
}

.nav-list a:hover {
  background-color: #3d566e;
}

.active-link {
  background-color: #34495e;
  padding: 10px 0;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .nav-list {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  .nav-list li {
    margin: 10px 0;
  }

  .main-content {
    margin-left: 0;
  }
}
</style>
