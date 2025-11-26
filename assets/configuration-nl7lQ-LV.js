const n=`---
title: Configuration
---

<h1 id="configuration">Configuration</h1>
<p>You can configure <code>ngx-persist</code> globally for your application using the <code>provideNgxPersist</code> function.</p><h2 id="global-configuration">Global Configuration</h2>
<p>Add <code>provideNgxPersist</code> to your application&#39;s provider list (usually in <code>app.config.ts</code>).</p><pre><code class="language-typescript"><span class="token comment">// app.config.ts</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ApplicationConfig <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> provideNgxPersist <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> appConfig<span class="token operator">:</span> ApplicationConfig <span class="token operator">=</span> <span class="token punctuation">{</span>
  providers<span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token function">provideNgxPersist</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      prefix<span class="token operator">:</span> <span class="token string">'myapp'</span> <span class="token comment">// Optional prefix for all keys</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><h3 id="options">Options</h3>
<table>
<thead>
<tr>
<th align="left">Option</th>
<th align="left">Type</th>
<th align="left">Default</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody><tr>
<td align="left"><code>prefix</code></td>
<td align="left"><code>string</code></td>
<td align="left"><code>undefined</code></td>
<td align="left"><strong>Deprecated</strong> (Use <code>namespace</code>). A string to prefix all storage keys.</td>
</tr>
<tr>
<td align="left"><code>namespace</code></td>
<td align="left"><code>string</code></td>
<td align="left"><code>undefined</code></td>
<td align="left">A global namespace for your application keys (e.g., <code>'my-app'</code>). This prevents key collisions when running multiple apps on the same domain (like localhost).</td>
</tr>
</tbody></table>
<h2 id="cross-tab-synchronization">Cross-Tab Synchronization</h2>
<p>By default, <code>ngx-persist</code> automatically enables <strong>Cross-Tab Synchronization</strong> for <code>LocalStorage</code> and <code>SessionStorage</code>.</p><p>If a user changes a setting in one tab, it will instantly update in all other open tabs using the <code>BroadcastChannel</code> API. No extra configuration is required!</p><h2 id="key-prefixing">Key Prefixing</h2>
<p>If you set a <code>prefix</code> of <code>'myapp'</code>, a signal with key <code>'settings'</code> will be stored in LocalStorage as <code>'myapp:settings'</code>.</p><pre><code class="language-typescript"><span class="token comment">// app.config.ts</span>
<span class="token function">provideNgxPersist</span><span class="token punctuation">(</span><span class="token punctuation">{</span> prefix<span class="token operator">:</span> <span class="token string">'shop'</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token comment">// component.ts</span>
<span class="token keyword">const</span> cart <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span> key<span class="token operator">:</span> <span class="token string">'cart'</span><span class="token punctuation">,</span> <span class="token operator">...</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Storage: 'shop:cart'</span>
</code></pre>`;export{n as default};
