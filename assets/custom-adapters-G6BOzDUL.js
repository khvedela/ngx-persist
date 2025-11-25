const s=`---
title: Custom Adapters
---

<h1 id="custom-adapters-1">Custom Adapters</h1>
<p><code>ngx-persist</code> is designed to be extensible. If the built-in <a href="/storage-adapters/local-storage">LocalStorage</a>, <a href="/storage-adapters/session-storage">SessionStorage</a>, <a href="/storage-adapters/indxed-db">IndexedDB</a>, or <a href="/storage-adapters/memory">In-Memory</a> adapters don&#39;t meet your needs, you can create your own.</p><p>Common use cases for custom adapters include:</p><ul>
<li>Syncing with a backend API.</li>
<li>Using <code>AsyncStorage</code> in an Ionic/Capacitor app.</li>
<li>Integrating with Firebase or Supabase.</li>
<li>Encrypting data before storage.</li>
</ul>
<h2 id="storageadapter-interface-3">StorageAdapter Interface</h2>
<p>To create a custom adapter, implement the <code>StorageAdapter</code> interface:</p><pre><code class="language-typescript"><span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">StorageAdapter</span> <span class="token punctuation">{</span>
  <span class="token comment">/**
   * Whether the adapter operations are asynchronous.
   * If true, the signal will update asynchronously after hydration.
   */</span>
  <span class="token keyword">readonly</span> isAsync<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>

  <span class="token function">getItem</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token keyword">null</span> <span class="token operator">|</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">string</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token operator">></span><span class="token punctuation">;</span>
  <span class="token function">setItem</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> value<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token operator">|</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token operator">></span><span class="token punctuation">;</span>
  <span class="token function">removeItem</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token operator">|</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token operator">></span><span class="token punctuation">;</span>
  clear<span class="token operator">?</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token operator">|</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token operator">></span><span class="token punctuation">;</span>

  <span class="token comment">/**
   * Optional subscription mechanism for cross-tab / cross-context sync.
   * listener(null) can mean "clear all" depending on adapter semantics.
   */</span>
  subscribe<span class="token operator">?</span><span class="token punctuation">(</span><span class="token function-variable function">listener</span><span class="token operator">:</span> <span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="detailed-examples-1">Detailed Examples</h2>
<p>We have created detailed guides for common custom adapter use cases:</p><ul>
<li><a href="/storage-adapters/examples/api-sync"><strong>API Sync Adapter</strong></a>: Sync state with a backend API using <code>HttpClient</code>.</li>
<li><a href="/storage-adapters/examples/ionic-storage"><strong>Ionic &amp; Capacitor</strong></a>: Use native mobile storage with <code>@capacitor/preferences</code>.</li>
<li><a href="/storage-adapters/examples/firebase-sync"><strong>Firebase Sync</strong></a>: Real-time synchronization across devices using Firestore.</li>
<li><a href="/storage-adapters/examples/encryption"><strong>Encrypted Storage</strong></a>: Encrypt data before saving it to LocalStorage.</li>
</ul>
<p>Check out these guides to see how to implement <code>StorageAdapter</code> for your specific needs.</p><h2 id="best-practices-3">Best Practices</h2>
<ol>
<li><strong>Error Handling</strong>: Wrap your storage calls in <code>try/catch</code> blocks. If <code>getItem</code> fails, return <code>null</code> so the signal falls back to its initial value.</li>
<li><strong>Type Safety</strong>: Avoid <code>any</code>. Use proper types for your data structures.</li>
<li><strong>Async vs Sync</strong>: If your storage mechanism is synchronous (like <code>localStorage</code>), set <code>isAsync = false</code>. If it involves Promises (like <code>fetch</code> or <code>indexedDB</code>), set <code>isAsync = true</code>.</li>
</ol>
`;export{s as default};
