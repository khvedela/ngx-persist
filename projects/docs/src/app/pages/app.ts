import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <!-- Toolbar -->
      <header class="app-toolbar mat-elevation-z4">
        <div class="toolbar-row">
          <button class="menu-button" aria-label="Menu">
            <span class="material-icons">menu</span>
          </button>
          <a routerLink="/" class="logo">
            <span class="logo-text">NgxPersist</span>
            <span class="version-badge">v0.0.1</span>
          </a>
          <span class="spacer"></span>
          <nav class="toolbar-nav">
            <a href="https://github.com/david/ngx-persist" target="_blank" class="github-link">
              <span class="material-icons">code</span>
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <!-- Sidenav Container -->
      <div class="sidenav-container">
        <!-- Sidenav -->
        <aside class="sidenav">
          <nav class="sidenav-nav">
            <div class="nav-group">
              <h3 class="nav-group-title">Getting Started</h3>
              <a routerLink="/getting-started/introduction" routerLinkActive="active" class="nav-item">Introduction</a>
              <a routerLink="/getting-started/installation" routerLinkActive="active" class="nav-item">Installation</a>
            </div>
            
            <div class="nav-divider"></div>

            <div class="nav-group">
              <h3 class="nav-group-title">Usage</h3>
              <a routerLink="/usage/usage-guide" routerLinkActive="active" class="nav-item">Basic Usage</a>
              <a routerLink="/usage/configuration" routerLinkActive="active" class="nav-item">Configuration</a>
              <a routerLink="/usage/advanced-usage" routerLinkActive="active" class="nav-item">Advanced Usage</a>
              <a routerLink="/usage/linked-signals" routerLinkActive="active" class="nav-item">Linked Signals</a>
              <a routerLink="/usage/resource-api" routerLinkActive="active" class="nav-item">Resource API</a>
            </div>

            <div class="nav-group">
              <h3 class="nav-group-title">Storage Adapters</h3>
              <a routerLink="/storage-adapters/local-storage" routerLinkActive="active" class="nav-item">LocalStorage</a>
              <a routerLink="/storage-adapters/session-storage" routerLinkActive="active" class="nav-item">SessionStorage</a>
              <a routerLink="/storage-adapters/indxed-db" routerLinkActive="active" class="nav-item">IndexedDB</a>
              <a routerLink="/storage-adapters/memory" routerLinkActive="active" class="nav-item">In-Memory</a>
              <a routerLink="/storage-adapters/custom-adapters" routerLinkActive="active" class="nav-item">Custom Adapters</a>
            </div>

            <div class="nav-group">
              <h3 class="nav-group-title">Examples</h3>
              <a routerLink="/storage-adapters/examples/api-sync" routerLinkActive="active" class="nav-item">API Sync</a>
              <a routerLink="/storage-adapters/examples/ionic-storage" routerLinkActive="active" class="nav-item">Ionic & Capacitor</a>
              <a routerLink="/storage-adapters/examples/firebase-sync" routerLinkActive="active" class="nav-item">Firebase Sync</a>
              <a routerLink="/storage-adapters/examples/encryption" routerLinkActive="active" class="nav-item">Encryption</a>
            </div>

            <div class="nav-divider"></div>

            <div class="nav-group">
              <h3 class="nav-group-title">Integrations</h3>
              <a routerLink="/integrations/ngrx-signal-store" routerLinkActive="active" class="nav-item">NGRX SignalStore</a>
            </div>

            <div class="nav-divider"></div>

            <div class="nav-group">
              <h3 class="nav-group-title">Reference</h3>
              <a routerLink="/reference/api" routerLinkActive="active" class="nav-item">API Reference</a>
            </div>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="content">
          <div class="content-inner markdown-content">
            <router-outlet></router-outlet>
          </div>
          <footer class="footer">
            <p>Powered by Angular & NgxPersist</p>
          </footer>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    /* Toolbar */
    .app-toolbar {
      position: relative;
      z-index: 20;
      height: var(--header-height);
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      padding: 0 16px;
    }

    .toolbar-row {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    .menu-button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      margin-right: 16px;
      display: none; /* Hidden on desktop */
    }

    @media (max-width: 768px) {
      .menu-button {
        display: block;
      }
    }

    .logo {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: white;
      gap: 12px;
    }

    .logo-text {
      font-size: 20px;
      font-weight: 500;
      letter-spacing: 0.02em;
    }

    .version-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .spacer {
      flex: 1;
    }

    .github-link {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      opacity: 0.9;
      transition: opacity 0.2s;
    }

    .github-link:hover {
      opacity: 1;
    }

    /* Sidenav Container */
    .sidenav-container {
      display: flex;
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    /* Sidenav */
    .sidenav {
      width: var(--sidenav-width);
      background: white;
      border-right: 1px solid var(--divider-color);
      overflow-y: auto;
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      .sidenav {
        display: none; /* Hide on mobile for now */
      }
    }

    .sidenav-nav {
      padding: 16px 0;
    }

    .nav-group-title {
      padding: 0 24px;
      margin: 16px 0 8px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      color: var(--text-secondary);
      letter-spacing: 0.05em;
    }

    .nav-item {
      display: block;
      padding: 0 24px;
      height: 40px;
      line-height: 40px;
      color: var(--text-primary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.2s;
      border-left: 4px solid transparent;
    }

    .nav-item:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .nav-item.active {
      color: var(--primary-color);
      background-color: rgba(63, 81, 181, 0.08); /* Primary color with opacity */
      border-left-color: var(--primary-color);
      font-weight: 500;
    }

    .nav-divider {
      height: 1px;
      background-color: var(--divider-color);
      margin: 8px 0;
    }

    /* Main Content */
    .content {
      flex: 1;
      overflow-y: auto;
      background: var(--bg-app);
      display: flex;
      flex-direction: column;
    }

    .content-inner {
      flex: 1;
      padding: 32px 48px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }

    @media (max-width: 768px) {
      .content-inner {
        padding: 24px 16px;
      }
    }

    .footer {
      padding: 24px;
      text-align: center;
      color: var(--text-secondary);
      font-size: 13px;
      border-top: 1px solid var(--divider-color);
      margin-top: auto;
    }
  `]
})
export class App { }