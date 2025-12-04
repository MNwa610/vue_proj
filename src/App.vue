<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <span class="brand-text">Генератор палитр</span>
        </div>
        <div class="nav-links">
          <router-link to="/" class="nav-link">Главная</router-link>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <p>Генератор цветовых палитр - Практики 27-28</p>
    </footer>
  </div>
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #667eea;
  background: #f0f0f0;
}

.nav-link.router-link-active {
  color: #667eea;
  background: #e7f3ff;
}

.main-content {
  flex: 1;
  padding-bottom: 60px;
}

.footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 20px;
  margin-top: auto;
}

.footer p {
  margin: 0;
  font-size: 14px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
}
</style>
