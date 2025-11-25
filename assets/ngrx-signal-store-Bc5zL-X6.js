const n=`---
title: NGRX SignalStore Integration
---

<h1 id="ngrx-signalstore-integration">NGRX SignalStore Integration</h1>
<p><code>ngx-persist</code> provides a seamless integration with <a href="https://ngrx.io/guide/signals">NGRX SignalStore</a>.</p><h2 id="installation-1">Installation</h2>
<p>Ensure you have <code>@ngrx/signals</code> installed.</p><h2 id="usage">Usage</h2>
<p>Use the <code>withPersist</code> feature to automatically hydrate and persist your store&#39;s state.</p><pre><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> signalStore<span class="token punctuation">,</span> withState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@ngrx/signals'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> withPersist <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist/integrations'</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> UserStore <span class="token operator">=</span> <span class="token function">signalStore</span><span class="token punctuation">(</span>
  <span class="token function">withState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> name<span class="token operator">:</span> <span class="token string">'Guest'</span><span class="token punctuation">,</span> theme<span class="token operator">:</span> <span class="token string">'light'</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token comment">// Persist the entire state to 'user-store' key</span>
  <span class="token function">withPersist</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    key<span class="token operator">:</span> <span class="token string">'user-store'</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><h3 id="configuration">Configuration</h3>
<p><code>withPersist</code> accepts a configuration object:</p><pre><code class="language-typescript"><span class="token function">withPersist</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  key<span class="token operator">:</span> <span class="token string">'my-store'</span><span class="token punctuation">,</span>
  <span class="token comment">// Optional: Use a specific adapter (defaults to global config)</span>
  adapter<span class="token operator">:</span> sessionStorageAdapter 
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><h2 id="how-it-works">How it Works</h2>
<ol>
<li><strong>Hydration</strong>: On initialization, <code>withPersist</code> checks the storage for the given key. If found, it parses the JSON and patches the store state.</li>
<li><strong>Persistence</strong>: It sets up an <code>effect</code> that watches the store state. Whenever the state changes, it serializes it and saves it to storage.</li>
</ol>
<blockquote>
<p>[!NOTE]
This feature currently persists the <strong>entire</strong> state slice managed by the store. Partial persistence configuration is coming soon.</p></blockquote>
`;export{n as default};
