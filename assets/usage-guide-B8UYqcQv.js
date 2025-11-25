const n=`---
title: Basic Usage
---

<h1 id="basic-usage-4">Basic Usage</h1>
<p>This guide covers the fundamentals of using <code>storageSignal</code> to manage persistent state in your Angular application.</p><h2 id="creating-a-storage-signal">Creating a Storage Signal</h2>
<p>The <code>storageSignal</code> function creates a writable signal that automatically syncs its value with storage (LocalStorage by default).</p><pre><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Component <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> storageSignal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  selector<span class="token operator">:</span> <span class="token string">'app-counter'</span><span class="token punctuation">,</span>
  standalone<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  template<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
    &lt;p>Count: {{ count() }}&lt;/p>
    &lt;button (click)="increment()">Increment&lt;/button>
  </span><span class="token template-punctuation string">\`</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">CounterComponent</span> <span class="token punctuation">{</span>
  <span class="token comment">// 1. Define a unique key</span>
  <span class="token comment">// 2. Provide an initial value</span>
  count <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    key<span class="token operator">:</span> <span class="token string">'counter'</span><span class="token punctuation">,</span>
    initial<span class="token operator">:</span> <span class="token number">0</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">increment</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 3. Update like a regular signal</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>count<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>c <span class="token operator">=></span> c <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="reading-the-value">Reading the Value</h2>
<p>Read the value just like any other Angular Signal: by calling it as a function.</p><pre><code class="language-typescript"><span class="token keyword">const</span> currentValue <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">count</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><p>In a template:</p><pre><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>Current count: {{ count() }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
</code></pre><h2 id="updating-the-value">Updating the Value</h2>
<p>You can set a new value directly or update it based on the previous value.</p><h3 id="set">Set</h3>
<pre><code class="language-typescript"><span class="token keyword">this</span><span class="token punctuation">.</span>count<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><h3 id="update">Update</h3>
<pre><code class="language-typescript"><span class="token keyword">this</span><span class="token punctuation">.</span>count<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>current <span class="token operator">=></span> current <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><h2 id="clearing-storage">Clearing Storage</h2>
<p>To reset the signal to its initial value and remove the item from storage, use the <code>clear()</code> method.</p><pre><code class="language-typescript"><span class="token keyword">this</span><span class="token punctuation">.</span>count<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// count() is now 0 (initial value)</span>
<span class="token comment">// localStorage.getItem('counter') is null</span>
</code></pre>`;export{n as default};
