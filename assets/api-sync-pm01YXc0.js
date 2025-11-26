const n=`---
title: API Sync Adapter
---

<h1 id="api-sync-adapter">API Sync Adapter</h1>
<p>This example demonstrates how to create a <code>StorageAdapter</code> that synchronizes state with a backend API using Angular&#39;s <code>HttpClient</code>. This allows your application state to persist across devices and sessions.</p><h2 id="implementation">Implementation</h2>
<p>We&#39;ll create an <code>ApiAdapter</code> service that implements <code>StorageAdapter</code>. Since API calls are asynchronous, we set <code>isAsync = true</code>.</p><pre><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Injectable<span class="token punctuation">,</span> inject <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> HttpClient <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/common/http'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> firstValueFrom <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'rxjs'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> StorageAdapter <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Injectable</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span> providedIn<span class="token operator">:</span> <span class="token string">'root'</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">ApiAdapter</span> <span class="token keyword">implements</span> <span class="token class-name">StorageAdapter</span> <span class="token punctuation">{</span>
  <span class="token keyword">readonly</span> isAsync <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
  <span class="token keyword">private</span> http <span class="token operator">=</span> <span class="token function">inject</span><span class="token punctuation">(</span>HttpClient<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">private</span> apiUrl <span class="token operator">=</span> <span class="token string">'https://api.example.com/user-settings'</span><span class="token punctuation">;</span>

  <span class="token keyword">async</span> <span class="token function">getItem</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">string</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token operator">></span> <span class="token punctuation">{</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
      <span class="token comment">// Fetch the value from the API</span>
      <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">firstValueFrom</span><span class="token punctuation">(</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>http<span class="token punctuation">.</span><span class="token generic-function"><span class="token function">get</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token punctuation">{</span> value<span class="token operator">:</span> <span class="token builtin">string</span> <span class="token punctuation">}</span><span class="token operator">></span></span></span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token keyword">this</span><span class="token punctuation">.</span>apiUrl<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> response<span class="token punctuation">.</span>value<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// If the key doesn't exist or the API fails, return null</span>
      <span class="token comment">// so the signal falls back to the initial value.</span>
      <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Failed to fetch key </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span> error<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">async</span> <span class="token function">setItem</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> value<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token operator">></span> <span class="token punctuation">{</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
      <span class="token keyword">await</span> <span class="token function">firstValueFrom</span><span class="token punctuation">(</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>http<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token keyword">this</span><span class="token punctuation">.</span>apiUrl<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span> <span class="token punctuation">{</span> value <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Failed to save key </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span> error<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// You might want to implement a retry strategy or offline queue here</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">async</span> <span class="token function">removeItem</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token operator">></span> <span class="token punctuation">{</span>
    <span class="token keyword">await</span> <span class="token function">firstValueFrom</span><span class="token punctuation">(</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>http<span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token keyword">this</span><span class="token punctuation">.</span>apiUrl<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="usage-with-storagesignal">Usage with storageSignal</h2>
<p>Inject the <code>ApiAdapter</code> and pass it to the <code>storageSignal</code> configuration.</p><pre><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Component<span class="token punctuation">,</span> inject <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> JsonPipe <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/common'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> storageSignal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ApiAdapter <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./api.adapter'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  selector<span class="token operator">:</span> <span class="token string">'app-user-profile'</span><span class="token punctuation">,</span>
  standalone<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  imports<span class="token operator">:</span> <span class="token punctuation">[</span>JsonPipe<span class="token punctuation">]</span><span class="token punctuation">,</span>
  template<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
    &lt;h2>User Profile&lt;/h2>
    
    @if (theme.isLoading()) {
        &lt;p>Loading preferences...&lt;/p>
    } @else {
        &lt;p>Current Theme: {{ theme() }}&lt;/p>
        
        &lt;button (click)="toggleTheme()">Toggle Theme&lt;/button>
    }
  </span><span class="token template-punctuation string">\`</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">UserProfileComponent</span> <span class="token punctuation">{</span>
  <span class="token keyword">private</span> apiAdapter <span class="token operator">=</span> <span class="token function">inject</span><span class="token punctuation">(</span>ApiAdapter<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// The signal will automatically fetch the initial value from the API</span>
  <span class="token comment">// and update the API whenever the signal value changes.</span>
  theme <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    key<span class="token operator">:</span> <span class="token string">'theme'</span><span class="token punctuation">,</span>
    initial<span class="token operator">:</span> <span class="token string">'light'</span><span class="token punctuation">,</span>
    adapter<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>apiAdapter
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">toggleTheme</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>theme<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>current <span class="token operator">=></span> current <span class="token operator">===</span> <span class="token string">'light'</span> <span class="token operator">?</span> <span class="token string">'dark'</span> <span class="token operator">:</span> <span class="token string">'light'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="advanced-real-time-updates">Advanced: Real-time Updates</h2>
<p>If your API supports WebSockets or Server-Sent Events, you can implement the <code>subscribe</code> method to update the signal when the data changes on the server (e.g., from another device).</p><pre><code class="language-typescript">  <span class="token comment">// In ApiAdapter</span>
  
  <span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token function-variable function">listener</span><span class="token operator">:</span> <span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> socket <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">WebSocket</span><span class="token punctuation">(</span><span class="token string">'wss://api.example.com/updates'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    
    socket<span class="token punctuation">.</span><span class="token function-variable function">onmessage</span> <span class="token operator">=</span> <span class="token punctuation">(</span>event<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> data <span class="token operator">=</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span>event<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// Assuming the server sends { key: 'theme', value: 'dark' }</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>data<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">listener</span><span class="token punctuation">(</span>data<span class="token punctuation">.</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>

    <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> socket<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
</code></pre>`;export{n as default};
