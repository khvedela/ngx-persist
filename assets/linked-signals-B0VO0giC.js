const n=`---
title: Linked Signals
---

<h1 id="linked-signals-3">Linked Signals</h1>
<p>Angular 19 introduced <code>linkedSignal</code>, a powerful primitive for state that depends on another signal (the &quot;source&quot;) but can be overridden by the user. When the source changes, the signal resets to a computed value.</p><p><code>ngx-persist</code> extends this pattern with <code>storageLinkedSignal</code>, which adds persistence to the mix.</p><h2 id="the-problem-1">The Problem</h2>
<p>Imagine a &quot;User Settings&quot; form.</p><ol>
<li>When you select User A, the form should load User A&#39;s settings.</li>
<li>You edit the settings (local state).</li>
<li>If you refresh the page, your edits should persist (persistence).</li>
<li>If you switch to User B, the form should reset to User B&#39;s settings (linked state).</li>
</ol>
<p>Standard <code>storageSignal</code> persists forever. Standard <code>linkedSignal</code> doesn&#39;t persist. <code>storageLinkedSignal</code> does both.</p><h2 id="usage-14">Usage</h2>
<pre><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Component<span class="token punctuation">,</span> input <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> storageLinkedSignal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">UserSettingsComponent</span> <span class="token punctuation">{</span>
  <span class="token comment">// Source signal (e.g. from router or parent)</span>
  userId <span class="token operator">=</span> input<span class="token punctuation">.</span><span class="token generic-function"><span class="token function">required</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token operator">></span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// The linked signal</span>
  settings <span class="token operator">=</span> <span class="token function">storageLinkedSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token comment">// 1. The key must be unique per user if you want separate storage</span>
    <span class="token function-variable function">key</span><span class="token operator">:</span> <span class="token punctuation">(</span>id<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">user_settings_</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>id<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span>
    
    <span class="token comment">// 2. The source signal to watch</span>
    source<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>userId<span class="token punctuation">,</span>
    
    <span class="token comment">// 3. The computation to run when source changes (or for initial value)</span>
    <span class="token function-variable function">computation</span><span class="token operator">:</span> <span class="token punctuation">(</span>id<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">createDefaultSettings</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="how-it-works-3">How It Works</h2>
<ol>
<li><p><strong>Initialization</strong>:</p><ul>
<li>It checks storage for the generated key.</li>
<li>If found, it uses the stored value.</li>
<li>If not found, it runs the <code>computation</code> function.</li>
</ul>
</li>
<li><p><strong>Source Change</strong>:</p><ul>
<li>When <code>userId</code> changes, the signal <strong>resets</strong>.</li>
<li>It re-generates the key (e.g. <code>user_settings_123</code> -&gt; <code>user_settings_456</code>).</li>
<li>It checks storage for the <em>new</em> key.</li>
<li>If found, it loads it. If not, it computes the default.</li>
</ul>
</li>
<li><p><strong>User Edit</strong>:</p><ul>
<li>When you call <code>settings.set(...)</code>, it updates the signal AND saves to storage under the <em>current</em> key.</li>
</ul>
</li>
</ol>
<h2 id="advanced-static-keys-1">Advanced: Static Keys</h2>
<p>Sometimes you want the key to be static, but the <em>value</em> to reset when a dependency changes.</p><pre><code class="language-typescript"><span class="token comment">// Example: A "Draft" that resets when you change the category</span>
category <span class="token operator">=</span> <span class="token function">signal</span><span class="token punctuation">(</span><span class="token string">'tech'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

draft <span class="token operator">=</span> <span class="token function">storageLinkedSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  key<span class="token operator">:</span> <span class="token string">'current_draft'</span><span class="token punctuation">,</span> <span class="token comment">// Static key!</span>
  source<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>category<span class="token punctuation">,</span>
  <span class="token function-variable function">computation</span><span class="token operator">:</span> <span class="token punctuation">(</span>cat<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Start writing about </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>cat<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">...</span><span class="token template-punctuation string">\`</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><p>In this case:</p><ol>
<li>You write &quot;Angular is cool&quot; (Saved to <code>current_draft</code>).</li>
<li>Change category to &#39;life&#39;.</li>
<li>Signal resets to &quot;Start writing about life...&quot; (Saved to <code>current_draft</code>, overwriting previous draft).</li>
</ol>
<p>This is useful for &quot;temporary&quot; persistence that should be cleared on context switch.</p>`;export{n as default};
