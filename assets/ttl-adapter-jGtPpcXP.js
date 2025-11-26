const n=`---
title: TTL Adapter
---

<h1 id="ttl-adapter">TTL Adapter</h1>
<p>The <code>withTTL</code> function wraps any existing storage adapter to add <strong>Time-To-Live (TTL)</strong> support. Data stored with this wrapper will automatically expire and be removed after a specified duration.</p><h2 id="use-cases-2">Use Cases</h2>
<ul>
<li><strong>API Caching</strong>: Cache API responses for a short period (e.g., 5 minutes) to reduce server load.</li>
<li><strong>User Sessions</strong>: Automatically expire user sessions after inactivity (if updated on access) or fixed time.</li>
<li><strong>Temporary Data</strong>: Store data that is only relevant for a short time.</li>
</ul>
<h2 id="usage-1">Usage</h2>
<p>Import <code>withTTL</code> and your desired adapter (e.g., <code>localStorageAdapter</code>) from <code>ngx-persist</code>.</p><pre><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Component <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> storageSignal<span class="token punctuation">,</span> withTTL<span class="token punctuation">,</span> localStorageAdapter <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  selector<span class="token operator">:</span> <span class="token string">'app-api-cache'</span><span class="token punctuation">,</span>
  standalone<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  template<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
    &lt;p>Cached Data: {{ data() }}&lt;/p>
    &lt;button (click)="refresh()">Refresh&lt;/button>
  </span><span class="token template-punctuation string">\`</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">ApiCacheComponent</span> <span class="token punctuation">{</span>
  <span class="token comment">// Create an adapter that expires items after 1 hour (3600000 ms)</span>
  <span class="token keyword">private</span> ttlAdapter <span class="token operator">=</span> <span class="token function">withTTL</span><span class="token punctuation">(</span>localStorageAdapter<span class="token punctuation">,</span> <span class="token number">1000</span> <span class="token operator">*</span> <span class="token number">60</span> <span class="token operator">*</span> <span class="token number">60</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  data <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    key<span class="token operator">:</span> <span class="token string">'api-data'</span><span class="token punctuation">,</span>
    initial<span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    adapter<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>ttlAdapter
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Fetch new data...</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token string">'New Data '</span> <span class="token operator">+</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toISOString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="how-it-works">How it Works</h2>
<p>When you store a value using <code>withTTL</code>, it wraps the value in an object containing the data and an expiry timestamp:</p><pre><code class="language-json"><span class="token punctuation">{</span>
  <span class="token property">"value"</span><span class="token operator">:</span> <span class="token string">"your-data"</span><span class="token punctuation">,</span>
  <span class="token property">"expiry"</span><span class="token operator">:</span> <span class="token number">1732635000000</span>
<span class="token punctuation">}</span>
</code></pre><p>When you retrieve the data:</p><ol>
<li>It checks the <code>expiry</code> timestamp.</li>
<li>If the current time is greater than <code>expiry</code>, the item is <strong>removed</strong> from storage and <code>null</code> is returned.</li>
<li>If the item is valid, the original <code>value</code> is returned.</li>
</ol>
<blockquote>
<p>[!NOTE]
If the underlying storage contains data that was not stored with <code>withTTL</code> (or has a different format), it will be treated as invalid/expired and removed upon access.</p></blockquote>
`;export{n as default};
