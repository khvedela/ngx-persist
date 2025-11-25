import { Component } from '@angular/core';
import { storageSignal } from 'ngx-persist';
import { JsonPipe } from '@angular/common';

interface UserSettings {
  theme: 'dark' | 'light';
  notifications: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <h1>ngx-persist Demo</h1>
    
    <section>
      <h2>Simple String (Session)</h2>
      <input #inp [value]="username()" (input)="username.set(inp.value)" placeholder="Type name...">
      <p>Value: {{ username() }}</p>
      <button (click)="username.clear()">Clear</button>
      <p><small>Refreshes persist (sessionStorage)</small></p>
    </section>

    <hr>

    <section>
      <h2>Complex Object (Local)</h2>
      <p>Current theme: <strong>{{ settings().theme }}</strong></p>
      <p>Notifications: {{ settings().notifications }}</p>
      
      <button (click)="toggleTheme()">Toggle Theme</button>
      <button (click)="toggleNotif()">Toggle Notifications</button>
      <button (click)="settings.clear()">Reset Settings</button>

      <pre>{{ settings() | json }}</pre>
      <p><small>Refreshes persist (localStorage)</small></p>
    </section>
  `,
  styles: [`
    :host { display: block; font-family: sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto; }
    section { margin-bottom: 2rem; padding: 1rem; border: 1px solid #ccc; border-radius: 8px; }
    button { margin-right: 0.5rem; cursor: pointer; }
    input { padding: 0.5rem; margin-right: 0.5rem; }
  `]
})
export class App {
  // Session storage example
  username = storageSignal<string>({
    key: 'username',
    initial: '',
    adapter: 'session'
  });

  // Local storage example (object)
  settings = storageSignal<UserSettings>({
    key: 'settings',
    initial: { theme: 'light', notifications: true }
  });

  toggleTheme() {
    this.settings.update(s => ({
      ...s,
      theme: s.theme === 'light' ? 'dark' : 'light'
    }));
  }

  toggleNotif() {
    this.settings.update(s => ({
      ...s,
      notifications: !s.notifications
    }));
  }
}