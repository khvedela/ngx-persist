const n=`---
title: Resource API Integration
---

<h1 id="resource-api-integration-1">Resource API Integration</h1>
<p>Angular 19 introduces the <code>resource</code> API (experimental) for handling asynchronous data fetching. <code>ngx-persist</code> provides a <code>persistResource</code> utility to easily add offline-first capabilities to your resources.</p><h2 id="the-problem-1">The Problem</h2>
<p>When you fetch data from an API:</p><ol>
<li><strong>Offline</strong>: If the user is offline, the fetch fails.</li>
<li><strong>Slow Network</strong>: The user sees a loading spinner every time they visit the page.</li>
</ol>
<p>We want a <strong>Stale-While-Revalidate</strong> strategy:</p><ol>
<li>Show cached data <em>immediately</em> (if available).</li>
<li>Fetch fresh data in the background.</li>
<li>Update the UI (and cache) when fresh data arrives.</li>
</ol>
<h2 id="usage-3">Usage</h2>
<p>Wrap your loader function with <code>persistResource</code>.</p><pre><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Component<span class="token punctuation">,</span> resource <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> persistResource <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">UserProfileComponent</span> <span class="token punctuation">{</span>
  userId <span class="token operator">=</span> input<span class="token punctuation">.</span><span class="token generic-function"><span class="token function">required</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token operator">></span></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  userResource <span class="token operator">=</span> <span class="token function">resource</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token comment">// The request depends on userId</span>
    <span class="token function-variable function">request</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span> id<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">userId</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    
    <span class="token comment">// Wrap the loader</span>
    loader<span class="token operator">:</span> <span class="token function">persistResource</span><span class="token punctuation">(</span>
      <span class="token comment">// Your original loader</span>
      <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token punctuation">{</span> request <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">fetch</span><span class="token punctuation">(</span>\\\`<span class="token operator">/</span>api<span class="token operator">/</span>users<span class="token operator">/</span>\\$<span class="token punctuation">{</span>request<span class="token punctuation">.</span>id<span class="token punctuation">}</span>\\\`<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> response<span class="token punctuation">.</span><span class="token function">json</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token comment">// Persistence options</span>
      <span class="token punctuation">{</span>
        <span class="token comment">// Dynamic key based on request params</span>
        <span class="token function-variable function">key</span><span class="token operator">:</span> <span class="token punctuation">(</span>params<span class="token punctuation">)</span> <span class="token operator">=></span> \\\`user_profile_\\$<span class="token punctuation">{</span>params<span class="token punctuation">.</span>request<span class="token punctuation">.</span>id<span class="token punctuation">}</span>\\\`<span class="token punctuation">,</span>
        
        <span class="token comment">// Optional: Custom adapter (defaults to localStorage)</span>
        adapter<span class="token operator">:</span> localStorageAdapter
      <span class="token punctuation">}</span>
    <span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="how-it-works-2">How It Works</h2>
<p><code>persistResource</code> modifies the loader behavior:</p><ol>
<li><strong>On Load</strong>:<ul>
<li>It tries to fetch from the API.</li>
<li><strong>Success</strong>: It saves the result to storage and returns it.</li>
<li><strong>Failure (Offline)</strong>: It catches the error, tries to load from storage, and returns the cached value. If storage is empty, it re-throws the error.</li>
</ul>
</li>
</ol>
<blockquote>
<p>[!NOTE]
Currently, Angular&#39;s <code>resource</code> API expects a single Promise return. This means we can&#39;t easily do &quot;Return Cache THEN Return Fresh&quot; in a single pass without triggering a reload.</p><p>The current implementation prioritizes <strong>Freshness</strong> (try network first), falling back to <strong>Cache</strong> only on failure.</p><p>Future versions of <code>ngx-persist</code> may implement a true &quot;Stale-While-Revalidate&quot; pattern once the Resource API stabilizes or supports streaming responses.</p></blockquote>
`;export{n as default};
