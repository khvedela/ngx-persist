const n=`---
title: In-Memory Adapter
---

<h1 id="in-memory-adapter">In-Memory Adapter</h1>
<p>The <code>MemoryAdapter</code> is a synchronous adapter that stores data in a JavaScript <code>Map</code>. Data stored in this adapter <strong>does not persist</strong> across page reloads.</p><h2 id="use-cases">Use Cases</h2>
<ul>
<li><strong>Testing</strong>: Use it in unit tests to avoid polluting LocalStorage.</li>
<li><strong>Server-Side Rendering (SSR)</strong>: Used automatically as a fallback when <code>window</code> is undefined.</li>
<li><strong>Temporary State</strong>: For state that should be global but cleared on refresh.</li>
</ul>
<h2 id="usage">Usage</h2>
<p>Import <code>MemoryAdapter</code> from <code>ngx-persist</code>.</p><pre><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Component <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> storageSignal<span class="token punctuation">,</span> MemoryAdapter <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  selector<span class="token operator">:</span> <span class="token string">'app-temp-state'</span><span class="token punctuation">,</span>
  standalone<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  template<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
    &lt;p>Session ID: {{ sessionId() }}&lt;/p>
    &lt;p>&lt;em>(This will reset on refresh)&lt;/em>&lt;/p>
  </span><span class="token template-punctuation string">\`</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">TempStateComponent</span> <span class="token punctuation">{</span>
  <span class="token comment">// Create a shared adapter instance if you want to share storage across signals</span>
  <span class="token keyword">private</span> adapter <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MemoryAdapter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  sessionId <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    key<span class="token operator">:</span> <span class="token string">'session-id'</span><span class="token punctuation">,</span>
    initial<span class="token operator">:</span> crypto<span class="token punctuation">.</span><span class="token function">randomUUID</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    adapter<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>adapter
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="ssr-fallback">SSR Fallback</h2>
<p><code>ngx-persist</code> automatically uses <code>MemoryAdapter</code> when running on the server (SSR). You don&#39;t need to configure this manually; it&#39;s handled by the <code>resolveAdapter</code> function internally.</p><p>However, if you want to explicitly force in-memory storage even in the browser, you can pass it explicitly as shown above.</p>`;export{n as default};
