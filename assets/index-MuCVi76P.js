const n=`---
title: NgxPersist Documentation
---

<h1 id="ngxpersist-1">NgxPersist</h1>
<p>Type-safe, signal-based persistent state primitive for Angular (17–21).</p><h2 id="install-1">Install</h2>
<pre><code class="language-bash"><span class="token function">npm</span> <span class="token function">install</span> ngx-persist
</code></pre><h2 id="setup-1">Setup</h2>
<pre><code class="language-ts"><span class="token comment">// app.config.ts</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> provideNgxPersist <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> appConfig<span class="token operator">:</span> ApplicationConfig <span class="token operator">=</span> <span class="token punctuation">{</span>
  providers<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token function">provideNgxPersist</span><span class="token punctuation">(</span><span class="token punctuation">{</span> prefix<span class="token operator">:</span> <span class="token string">'myapp'</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><h2 id="usage-17">Usage</h2>
<pre><code class="language-ts"><span class="token keyword">import</span> <span class="token punctuation">{</span> Component <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> storageSignal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>

<span class="token keyword">interface</span> <span class="token class-name">UserSettings</span> <span class="token punctuation">{</span>
  theme<span class="token operator">:</span> <span class="token string">'dark'</span> <span class="token operator">|</span> <span class="token string">'light'</span><span class="token punctuation">;</span>
  notifications<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  selector<span class="token operator">:</span> <span class="token string">'app-root'</span><span class="token punctuation">,</span>
  standalone<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  template<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
    &lt;p>Current theme: {{ settings().theme }}&lt;/p>
    &lt;button (click)="toggleTheme()">Toggle Theme&lt;/button>
  </span><span class="token template-punctuation string">\`</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">AppComponent</span> <span class="token punctuation">{</span>
  <span class="token comment">// Persists to localStorage with key "myapp:settings"</span>
  settings <span class="token operator">=</span> <span class="token generic-function"><span class="token function">storageSignal</span><span class="token generic class-name"><span class="token operator">&lt;</span>UserSettings<span class="token operator">></span></span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    key<span class="token operator">:</span> <span class="token string">'settings'</span><span class="token punctuation">,</span>
    initial<span class="token operator">:</span> <span class="token punctuation">{</span> theme<span class="token operator">:</span> <span class="token string">'light'</span><span class="token punctuation">,</span> notifications<span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">toggleTheme</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>settings<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>s <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token operator">...</span>s<span class="token punctuation">,</span>
      theme<span class="token operator">:</span> s<span class="token punctuation">.</span>theme <span class="token operator">===</span> <span class="token string">'light'</span> <span class="token operator">?</span> <span class="token string">'dark'</span> <span class="token operator">:</span> <span class="token string">'light'</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="live-demo-1">Live Demo</h2>
<p><app-demo-counter></app-demo-counter></p><h2 id="api-1">API</h2>
<h3 id="storagesignaloptions-4"><code>storageSignal<T>(options)</code></h3>
<p>Creates a signal that syncs with storage.</p><h3 id="storagesignal-methods-1"><code>StorageSignal<T></code> methods</h3>
<ul>
<li><code>()</code>: Read value.</li>
<li><code>set(value)</code>: Update value and storage.</li>
<li><code>update(fn)</code>: Update value based on current.</li>
<li><code>clear()</code>: Reset to initial and remove from storage.</li>
<li><code>key</code>: The actual namespaced key used.</li>
</ul>
<h3 id="providengxpersistconfig-3"><code>provideNgxPersist(config)</code></h3>
<p>Configures the library globally.</p><ul>
<li><code>config.prefix</code>: Optional string to prefix all keys (e.g., <code>app:key</code>).</li>
</ul>
<h3 id="storagesignaloptions-5"><code>StorageSignalOptions<T></code></h3>
<ul>
<li><code>key</code>: Unique key for storage.</li>
<li><code>initial</code>: Default value.</li>
<li><code>adapter</code>: &#39;local&#39; (default), &#39;session&#39;, or custom adapter.</li>
<li><code>serialize</code>: Custom serializer (default: <code>JSON.stringify</code>).</li>
<li><code>parse</code>: Custom parser (default: <code>JSON.parse</code>).</li>
</ul>
`;export{n as default};
