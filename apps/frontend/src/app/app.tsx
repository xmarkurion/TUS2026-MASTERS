import styles from './app.module.css';

export function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Welcome to TUS2026 Masters</h1>
        <p>Monorepo with Nx, Spring Boot, React, and Storybook</p>
      </header>
      <main className={styles.main}>
        <section className={styles.section}>
          <h2>Frontend</h2>
          <p>Built with React and TypeScript</p>
        </section>
        <section className={styles.section}>
          <h2>Backend</h2>
          <p>Powered by Spring Boot</p>
        </section>
        <section className={styles.section}>
          <h2>Storybook</h2>
          <p>Component library documentation</p>
        </section>
      </main>
    </div>
  );
}

export default App;
