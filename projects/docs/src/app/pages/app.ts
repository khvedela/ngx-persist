import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import packageJson from '../../../../ngx-persist/package.json';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-container">
      <!-- Toolbar -->
      <header class="app-toolbar mat-elevation-z4">
        <div class="toolbar-row">
          <button class="menu-button" aria-label="Menu" (click)="toggleSidenav()">
            <span class="material-icons">menu</span>
          </button>
          <a routerLink="/" class="logo">
            <span class="logo-text">NgxPersist</span>
            <span class="version-badge">v{{ version }}</span>
          </a>
          <span class="spacer"></span>
          <nav class="toolbar-nav">
            <a href="https://www.npmjs.com/package/ngx-persist" target="_blank" class="nav-icon-link" aria-label="NPM">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.129z"/></svg>
            </a>
            <a href="https://github.com/khvedela/ngx-persist" target="_blank" class="nav-icon-link" aria-label="GitHub">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </nav>
        </div>
      </header>

      <!-- Sidenav Container -->
      <div class="sidenav-container">
        <!-- Backdrop -->
        @if (isSidenavOpen()) {
          <div class="sidenav-backdrop" (click)="closeSidenav()"></div>
        }

        <!-- Sidenav -->
        <aside class="sidenav" [class.open]="isSidenavOpen()">
          <nav class="sidenav-nav" (click)="closeSidenav()">
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
              <a routerLink="/storage-adapters/ttl-adapter" routerLinkActive="active" class="nav-item">TTL Adapter</a>
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

    .toolbar-nav {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-icon-link {
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-decoration: none;
      opacity: 0.8;
      transition: opacity 0.2s;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .nav-icon-link:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.1);
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
      transition: transform 0.3s ease;
    }

    .sidenav-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 25;
      backdrop-filter: blur(2px);
    }

    @media (max-width: 768px) {
      .sidenav {
        position: fixed;
        top: var(--header-height);
        left: 0;
        bottom: 0;
        z-index: 30;
        transform: translateX(-100%);
        box-shadow: 4px 0 8px rgba(0,0,0,0.1);
      }

      .sidenav.open {
        transform: translateX(0);
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
export class App {
  isSidenavOpen = signal(false);
  version = packageJson.version;

  toggleSidenav() {
    this.isSidenavOpen.update(v => !v);
  }

  closeSidenav() {
    this.isSidenavOpen.set(false);
  }
}