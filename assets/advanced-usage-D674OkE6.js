const n=`---
title: Advanced Usage
---

<h1 id="advanced-usage-1">Advanced Usage</h1>
<p>Learn how to handle complex data types, optimize performance, and follow best practices.</p><h2 id="custom-serialization-1">Custom Serialization</h2>
<p>By default, <code>ngx-persist</code> uses <code>JSON.stringify</code> and <code>JSON.parse</code>. If you need to store types that JSON doesn&#39;t support natively (like <code>Date</code>, <code>Map</code>, or <code>Set</code>), you can provide custom serializers.</p><h3 id="example-storing-dates-1">Example: Storing Dates</h3>
<pre><code class="language-typescript"><span class="token keyword">const</span> lastLogin <span class="token operator">=</span> <span class="token generic-function"><span class="token function">storageSignal</span><span class="token generic class-name"><span class="token operator">&lt;</span>Date<span class="token operator">></span></span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  key<span class="token operator">:</span> <span class="token string">'last-login'</span><span class="token punctuation">,</span>
  initial<span class="token operator">:</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token comment">// Convert Date to ISO string for storage</span>
  <span class="token function-variable function">serialize</span><span class="token operator">:</span> <span class="token punctuation">(</span>date<span class="token punctuation">)</span> <span class="token operator">=></span> date<span class="token punctuation">.</span><span class="token function">toISOString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token comment">// Convert ISO string back to Date object</span>
  <span class="token function-variable function">parse</span><span class="token operator">:</span> <span class="token punctuation">(</span>isoString<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span>isoString<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><h3 id="example-storing-maps-1">Example: Storing Maps</h3>
<pre><code class="language-typescript"><span class="token keyword">const</span> settings <span class="token operator">=</span> <span class="token generic-function"><span class="token function">storageSignal</span><span class="token generic class-name"><span class="token operator">&lt;</span>Map<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token builtin">string</span><span class="token operator">>></span></span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  key<span class="token operator">:</span> <span class="token string">'app-settings'</span><span class="token punctuation">,</span>
  initial<span class="token operator">:</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token function-variable function">serialize</span><span class="token operator">:</span> <span class="token punctuation">(</span>map<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span><span class="token builtin">Array</span><span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>map<span class="token punctuation">.</span><span class="token function">entries</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token function-variable function">parse</span><span class="token operator">:</span> <span class="token punctuation">(</span>json<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span>json<span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><h2 id="async-handling-1">Async Handling</h2>
<p>When using asynchronous adapters (like IndexedDB or API), the signal might not have the stored value immediately upon creation.</p><h3 id="the-loaded-signal-1">The <code>loaded</code> Signal</h3>
<p><code>storageSignal</code> exposes a <code>loaded</code> property which is a signal indicating if the data has been hydrated from storage.</p><pre><code class="language-typescript"><span class="token keyword">const</span> theme <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span> key<span class="token operator">:</span> <span class="token string">'theme'</span><span class="token punctuation">,</span> adapter<span class="token operator">:</span> indexedDbAdapter <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// In your template</span>
@<span class="token keyword">if</span> <span class="token punctuation">(</span>theme<span class="token punctuation">.</span><span class="token function">loaded</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token operator">&lt;</span>p<span class="token operator">></span>Current theme<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token function">theme</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>p<span class="token operator">></span>
<span class="token punctuation">}</span> @<span class="token keyword">else</span> <span class="token punctuation">{</span>
  <span class="token operator">&lt;</span>p<span class="token operator">></span>Loading<span class="token operator">...</span><span class="token operator">&lt;</span><span class="token operator">/</span>p<span class="token operator">></span>
<span class="token punctuation">}</span>
</code></pre><h2 id="linked-signals-2">Linked Signals</h2>
<p>Angular 19 introduces <code>linkedSignal</code> for state that depends on another signal but can be overridden. <code>ngx-persist</code> supports this pattern with <code>storageLinkedSignal</code>.</p><p><a href="/usage/linked-signals"><strong>Read the full guide on Linked Signals</strong></a></p><h2 id="resource-api-integration-2">Resource API Integration</h2>
<p>For offline-first data fetching, you can use <code>persistResource</code> to wrap an Angular <code>ResourceLoader</code>.</p><p><a href="/usage/resource-api"><strong>Read the full guide on Resource API</strong></a></p><h2 id="best-practices-7">Best Practices</h2>
<h3 id="1-key-naming-1">1. Key Naming</h3>
<p>Use consistent, descriptive keys. If you haven&#39;t set a global prefix, consider namespacing your keys manually (e.g., <code>'user:profile'</code>, <code>'ui:theme'</code>).</p><h3 id="2-state-size-1">2. State Size</h3>
<p>LocalStorage is synchronous and limited to ~5MB.</p><ul>
<li><strong>Avoid</strong> storing large blobs, images, or huge lists.</li>
<li><strong>Use</strong> <a href="/indexeddb">IndexedDB</a> for larger datasets.</li>
</ul>
<h3 id="3-server-side-rendering-ssr-1">3. Server-Side Rendering (SSR)</h3>
<p><code>ngx-persist</code> is fully compatible with Angular SSR.</p><ul>
<li><strong>Server</strong>: The signal uses the <code>initial</code> value. No storage access happens.</li>
<li><strong>Client</strong>: The signal hydrates from the configured storage adapter.</li>
</ul>
<h3 id="4-security-1">4. Security</h3>
<p><strong>Never store sensitive information</strong> (passwords, auth tokens, PII) in LocalStorage or SessionStorage, as they are accessible by any JavaScript running on the page (including XSS attacks).</p>`;export{n as default};
