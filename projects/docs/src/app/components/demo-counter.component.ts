import { Component } from '@angular/core';
import { storageSignal } from 'ngx-persist';

@Component({
  selector: 'app-demo-counter',
  standalone: true,
  template: `
    <div class="demo-box">
      <h3>Interactive Demo</h3>
      <p>
        Current Count: <strong>{{ counter() }}</strong>
      </p>
      <div class="controls">
        <button (click)="increment()">+ Increment</button>
        <button (click)="decrement()">- Decrement</button>
        <button (click)="counter.clear()">Reset</button>
      </div>
      <p><small>Refresh the page! This value persists in localStorage.</small></p>
    </div>
  `,
  styles: [`
    .demo-box {
      border: 1px solid #ccc;
      padding: 1.5rem;
      border-radius: 8px;
      margin: 1rem 0;
      background-color: #f9f9f9;
    }
    .controls button {
      margin-right: 0.5rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
  `]
})
export class DemoCounterComponent {
  counter = storageSignal<number>({
    key: 'demo-counter',
    initial: 0
  });

  increment() {
    this.counter.update(n => n + 1);
  }

  decrement() {
    this.counter.update(n => n - 1);
  }
}
