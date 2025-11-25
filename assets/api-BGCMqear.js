const n=`---
title: API Reference
---

<h1 id="api-reference-1">API Reference</h1>
<h2 id="storagesignaloptions-3"><code>storageSignal<T>(options)</code></h2>
<p>Creates a writable signal that persists its value.</p><p><strong>Options:</strong></p><table>
<thead>
<tr>
<th align="left">Option</th>
<th align="left">Type</th>
<th align="left">Default</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody><tr>
<td align="left"><code>key</code></td>
<td align="left"><code>string</code></td>
<td align="left"><strong>Required</strong></td>
<td align="left">The unique key for storage.</td>
</tr>
<tr>
<td align="left"><code>initial</code></td>
<td align="left"><code>T</code></td>
<td align="left"><strong>Required</strong></td>
<td align="left">The initial value if storage is empty.</td>
</tr>
<tr>
<td align="left"><code>adapter</code></td>
<td align="left"><code>'local' | 'session' | StorageAdapter</code></td>
<td align="left"><code>'local'</code></td>
<td align="left">The storage backend to use.</td>
</tr>
<tr>
<td align="left"><code>serialize</code></td>
<td align="left"><code>(value: T) => string</code></td>
<td align="left"><code>JSON.stringify</code></td>
<td align="left">Function to serialize state to string.</td>
</tr>
<tr>
<td align="left"><code>parse</code></td>
<td align="left"><code>(raw: string) => T</code></td>
<td align="left"><code>JSON.parse</code></td>
<td align="left">Function to parse string back to state.</td>
</tr>
</tbody></table>
<p><strong>Return Value (<code>StorageSignal<T></code>):</strong></p><p>The returned signal has the standard Signal API plus:</p><ul>
<li><code>set(value: T)</code>: Updates the value and writes to storage.</li>
<li><code>update(fn: (value: T) => T)</code>: Updates based on current value and writes to storage.</li>
<li><code>clear()</code>: Resets to the initial value and removes the item from storage.</li>
<li><code>key</code>: The fully qualified key used (including prefix).</li>
</ul>
<h2 id="providengxpersistconfig-2"><code>provideNgxPersist(config)</code></h2>
<p>Configures the library globally.</p><p><strong>Config:</strong></p><table>
<thead>
<tr>
<th align="left">Property</th>
<th align="left">Type</th>
<th align="left">Default</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody><tr>
<td align="left"><code>prefix</code></td>
<td align="left"><code>string</code></td>
<td align="left"><code>''</code></td>
<td align="left">Optional string to prefix all keys (e.g., <code>app:</code>).</td>
</tr>
</tbody></table>
<h2 id="storageadapter-interface-2"><code>StorageAdapter</code> Interface</h2>
<p>Interface for implementing custom storage adapters.</p><pre><code class="language-typescript"><span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">StorageAdapter</span> <span class="token punctuation">{</span>
  <span class="token keyword">readonly</span> isAsync<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>

  <span class="token function">getItem</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token keyword">null</span> <span class="token operator">|</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">string</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token operator">></span><span class="token punctuation">;</span>
  <span class="token function">setItem</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> value<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token operator">|</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token operator">></span><span class="token punctuation">;</span>
  <span class="token function">removeItem</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token operator">|</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token operator">></span><span class="token punctuation">;</span>
  clear<span class="token operator">?</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token operator">|</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token operator">></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>`;export{n as default};
