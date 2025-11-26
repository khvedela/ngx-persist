const n=`---
title: IndexedDB Adapter
---

<h1 id="indexeddb-adapter">IndexedDB Adapter</h1>
<p>The <code>IndexedDbAdapter</code> is a built-in asynchronous storage adapter for <strong>IndexedDB</strong>. It is ideal for storing large datasets, files, or complex objects that exceed the quota of LocalStorage.</p><h2 id="usage-9">Usage</h2>
<p>Import <code>IndexedDbAdapter</code> from <code>ngx-persist</code> and pass it to <code>storageSignal</code>.</p><pre><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Component <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> storageSignal<span class="token punctuation">,</span> IndexedDbAdapter <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  selector<span class="token operator">:</span> <span class="token string">'app-large-data'</span><span class="token punctuation">,</span>
  standalone<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  template<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
    &lt;div class="data-manager">
      &lt;h2>Large Dataset Manager&lt;/h2>
      &lt;p>Storing {{ products().length }} products in IndexedDB&lt;/p>
      &lt;button (click)="addProduct()">Add Product&lt;/button>
    &lt;/div>
  </span><span class="token template-punctuation string">\`</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">LargeDataComponent</span> <span class="token punctuation">{</span>
  <span class="token comment">// Create an instance of the adapter</span>
  <span class="token comment">// Optional: Pass dbName and storeName to the constructor</span>
  <span class="token keyword">private</span> adapter <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">IndexedDbAdapter</span><span class="token punctuation">(</span><span class="token string">'myapp-db'</span><span class="token punctuation">,</span> <span class="token string">'products'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  products <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    key<span class="token operator">:</span> <span class="token string">'product-catalog'</span><span class="token punctuation">,</span>
    initial<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token keyword">as</span> Product<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    adapter<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>adapter
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">addProduct</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>products<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>current <span class="token operator">=></span> <span class="token punctuation">[</span><span class="token operator">...</span>current<span class="token punctuation">,</span> <span class="token punctuation">{</span> id<span class="token operator">:</span> Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> name<span class="token operator">:</span> <span class="token string">'New Product'</span> <span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">interface</span> <span class="token class-name">Product</span> <span class="token punctuation">{</span>
  id<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
  name<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="configuration-2">Configuration</h2>
<p>The <code>IndexedDbAdapter</code> constructor accepts two optional arguments:</p><ol>
<li><code>dbName</code> (default: <code>'ngx-persist-db'</code>): The name of the IndexedDB database.</li>
<li><code>storeName</code> (default: <code>'key-value-store'</code>): The name of the object store within the database.</li>
</ol>
<pre><code class="language-typescript"><span class="token comment">// Custom configuration</span>
<span class="token keyword">const</span> adapter <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">IndexedDbAdapter</span><span class="token punctuation">(</span><span class="token string">'my-custom-db'</span><span class="token punctuation">,</span> <span class="token string">'user-settings'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><h2 id="async-hydration">Async Hydration</h2>
<p>Since IndexedDB is asynchronous, the signal will initially hold the <code>initial</code> value. Once the data is retrieved from the database, the signal will update automatically.</p><blockquote>
<p>Ensure your UI can handle the initial state gracefully while data is loading.</p></blockquote>
<pre><code class="language-typescript"><span class="token keyword">const</span> data <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  key<span class="token operator">:</span> <span class="token string">'async-data'</span><span class="token punctuation">,</span>
  initial<span class="token operator">:</span> <span class="token punctuation">{</span> loaded<span class="token operator">:</span> <span class="token boolean">false</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token comment">// Initial state</span>
  adapter<span class="token operator">:</span> <span class="token keyword">new</span> <span class="token class-name">IndexedDbAdapter</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// ... milliseconds later ...</span>
<span class="token comment">// Signal updates to: { loaded: true, ...data }</span>
</code></pre>`;export{n as default};
