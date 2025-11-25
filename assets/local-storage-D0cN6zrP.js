const n=`---
title: LocalStorage Adapter
---

<h1 id="localstorage-adapter-1">LocalStorage Adapter</h1>
<p>The <strong>localStorage</strong> adapter is the default storage backend for <code>ngx-persist</code>. It provides persistent storage that survives browser sessions and page reloads.</p><h2 id="overview-2">Overview</h2>
<p>LocalStorage is ideal for:</p><ul>
<li>User preferences (theme, language, settings)</li>
<li>Shopping cart data</li>
<li>Form drafts</li>
<li>UI state that should persist across sessions</li>
</ul>
<h2 id="basic-usage-3">Basic Usage</h2>
<p>By default, <code>storageSignal</code> uses localStorage, so you don&#39;t need to explicitly specify it.</p><pre><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Component <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> storageSignal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  selector<span class="token operator">:</span> <span class="token string">'app-user-preferences'</span><span class="token punctuation">,</span>
  standalone<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  template<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
    &lt;div class="preferences">
      &lt;h2>User Preferences&lt;/h2>
      
      &lt;label>
        Theme:
        &lt;select [value]="preferences().theme" (change)="updateTheme($event)">
          &lt;option value="light">Light&lt;/option>
          &lt;option value="dark">Dark&lt;/option>
          &lt;option value="auto">Auto&lt;/option>
        &lt;/select>
      &lt;/label>

      &lt;label>
        &lt;input 
          type="checkbox" 
          [checked]="preferences().notifications" 
          (change)="toggleNotifications()"
        />
        Enable Notifications
      &lt;/label>
    &lt;/div>
  </span><span class="token template-punctuation string">\`</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">UserPreferencesComponent</span> <span class="token punctuation">{</span>
  preferences <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    key<span class="token operator">:</span> <span class="token string">'user-preferences'</span><span class="token punctuation">,</span>
    initial<span class="token operator">:</span> <span class="token punctuation">{</span>
      theme<span class="token operator">:</span> <span class="token string">'light'</span> <span class="token keyword">as</span> <span class="token string">'light'</span> <span class="token operator">|</span> <span class="token string">'dark'</span> <span class="token operator">|</span> <span class="token string">'auto'</span><span class="token punctuation">,</span>
      notifications<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      language<span class="token operator">:</span> <span class="token string">'en'</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">updateTheme</span><span class="token punctuation">(</span>event<span class="token operator">:</span> Event<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> theme <span class="token operator">=</span> <span class="token punctuation">(</span>event<span class="token punctuation">.</span>target <span class="token keyword">as</span> HTMLSelectElement<span class="token punctuation">)</span><span class="token punctuation">.</span>value <span class="token keyword">as</span> <span class="token string">'light'</span> <span class="token operator">|</span> <span class="token string">'dark'</span> <span class="token operator">|</span> <span class="token string">'auto'</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>preferences<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>p <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token operator">...</span>p<span class="token punctuation">,</span> theme <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">toggleNotifications</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>preferences<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>p <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token operator">...</span>p<span class="token punctuation">,</span> notifications<span class="token operator">:</span> <span class="token operator">!</span>p<span class="token punctuation">.</span>notifications <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="explicit-configuration-1">Explicit Configuration</h2>
<p>You can explicitly specify the localStorage adapter:</p><pre><code class="language-typescript"><span class="token keyword">const</span> settings <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  key<span class="token operator">:</span> <span class="token string">'app-settings'</span><span class="token punctuation">,</span>
  initial<span class="token operator">:</span> <span class="token punctuation">{</span> darkMode<span class="token operator">:</span> <span class="token boolean">false</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
  adapter<span class="token operator">:</span> <span class="token string">'local'</span> <span class="token comment">// Explicitly use localStorage</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><h2 id="storage-limits-1">Storage Limits</h2>
<p>LocalStorage has a size limit of approximately <strong>5-10 MB</strong> (varies by browser). Keep this in mind when storing data:</p><pre><code class="language-typescript"><span class="token comment">// ✅ Good: Small, structured data</span>
<span class="token keyword">const</span> userSettings <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  key<span class="token operator">:</span> <span class="token string">'settings'</span><span class="token punctuation">,</span>
  initial<span class="token operator">:</span> <span class="token punctuation">{</span> theme<span class="token operator">:</span> <span class="token string">'light'</span><span class="token punctuation">,</span> fontSize<span class="token operator">:</span> <span class="token number">14</span> <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// ❌ Bad: Large datasets</span>
<span class="token keyword">const</span> allProducts <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  key<span class="token operator">:</span> <span class="token string">'products'</span><span class="token punctuation">,</span>  
  initial<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token keyword">as</span> Product<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token comment">// Could exceed localStorage limits</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><h2 id="best-practices-5">Best Practices</h2>
<h3 id="1-use-descriptive-keys-1">1. Use Descriptive Keys</h3>
<pre><code class="language-typescript"><span class="token comment">// ✅ Good</span>
<span class="token keyword">const</span> cartItems <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span> key<span class="token operator">:</span> <span class="token string">'shopping-cart-items'</span><span class="token punctuation">,</span> initial<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// ❌ Bad</span>
<span class="token keyword">const</span> items <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span> key<span class="token operator">:</span> <span class="token string">'items'</span><span class="token punctuation">,</span> initial<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><h3 id="2-provide-sensible-defaults-1">2. Provide Sensible Defaults</h3>
<pre><code class="language-typescript"><span class="token keyword">const</span> userPrefs <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  key<span class="token operator">:</span> <span class="token string">'user-prefs'</span><span class="token punctuation">,</span>
  initial<span class="token operator">:</span> <span class="token punctuation">{</span>
    theme<span class="token operator">:</span> <span class="token string">'light'</span><span class="token punctuation">,</span>
    language<span class="token operator">:</span> navigator<span class="token punctuation">.</span>language <span class="token operator">||</span> <span class="token string">'en'</span><span class="token punctuation">,</span>
    compactMode<span class="token operator">:</span> <span class="token boolean">false</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><h3 id="3-keep-state-flat-1">3. Keep State Flat</h3>
<pre><code class="language-typescript"><span class="token comment">// ✅ Good: Flat structure</span>
<span class="token keyword">interface</span> <span class="token class-name">AppState</span> <span class="token punctuation">{</span>
  userId<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
  lastVisit<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
  preferences<span class="token operator">:</span> Record<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token builtin">boolean</span><span class="token operator">></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// ⚠️ Avoid: Deeply nested structures</span>
<span class="token keyword">interface</span> <span class="token class-name">ComplexState</span> <span class="token punctuation">{</span>
  user<span class="token operator">:</span> <span class="token punctuation">{</span>
    profile<span class="token operator">:</span> <span class="token punctuation">{</span>
      settings<span class="token operator">:</span> <span class="token punctuation">{</span>
        display<span class="token operator">:</span> <span class="token punctuation">{</span>
          theme<span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="clearing-data-1">Clearing Data</h2>
<p>You can clear stored data using the <code>clear()</code> method:</p><pre><code class="language-typescript"><span class="token keyword">const</span> prefs <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  key<span class="token operator">:</span> <span class="token string">'preferences'</span><span class="token punctuation">,</span>
  initial<span class="token operator">:</span> <span class="token punctuation">{</span> theme<span class="token operator">:</span> <span class="token string">'light'</span> <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Reset to initial value and remove from localStorage</span>
prefs<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><h2 id="browser-compatibility-2">Browser Compatibility</h2>
<p>LocalStorage is supported in all modern browsers:</p><ul>
<li>✅ Chrome, Edge, Firefox, Safari</li>
<li>✅ Mobile browsers (iOS Safari, Chrome Mobile)</li>
<li>⚠️ Private/Incognito mode may have restrictions</li>
<li>❌ Not available in Web Workers</li>
</ul>
<h2 id="next-steps-2">Next Steps</h2>
<ul>
<li>Learn about <a href="/session-storage">SessionStorage</a> for temporary data</li>
<li>Implement <a href="/custom-adapters">Custom Adapters</a> for advanced use cases</li>
</ul>
`;export{n as default};
