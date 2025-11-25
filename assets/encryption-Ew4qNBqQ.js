const n=`---
title: Encrypted Storage
---

<h1 id="encrypted-storage-1">Encrypted Storage</h1>
<p>Sometimes you need to store sensitive data on the client. You can create a &quot;Decorator&quot; adapter that encrypts data before passing it to the underlying storage (like LocalStorage) and decrypts it when retrieving.</p><h2 id="implementation-5">Implementation</h2>
<p>This adapter wraps another <code>StorageAdapter</code>.</p><pre><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Injectable<span class="token punctuation">,</span> inject <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> StorageAdapter <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> LocalStorageAdapter <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist/adapters'</span><span class="token punctuation">;</span> <span class="token comment">// Assuming this is available or use window.localStorage</span>

<span class="token comment">// Mock encryption functions (Replace with a real library like crypto-js)</span>
<span class="token keyword">const</span> <span class="token function-variable function">encrypt</span> <span class="token operator">=</span> <span class="token punctuation">(</span>text<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">btoa</span><span class="token punctuation">(</span>text<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">''</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">reverse</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">''</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token function-variable function">decrypt</span> <span class="token operator">=</span> <span class="token punctuation">(</span>text<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">atob</span><span class="token punctuation">(</span>text<span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">''</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">reverse</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">''</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Injectable</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span> providedIn<span class="token operator">:</span> <span class="token string">'root'</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">EncryptedAdapter</span> <span class="token keyword">implements</span> <span class="token class-name">StorageAdapter</span> <span class="token punctuation">{</span>
  <span class="token comment">// We mirror the async nature of the underlying adapter</span>
  <span class="token keyword">readonly</span> isAsync <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span> 
  
  <span class="token comment">// We can wrap any adapter here. For this example, we use LocalStorage.</span>
  <span class="token comment">// In a real app, you might inject the underlying adapter via a token.</span>
  <span class="token keyword">private</span> underlyingAdapter <span class="token operator">=</span> window<span class="token punctuation">.</span>localStorage<span class="token punctuation">;</span>

  <span class="token function">getItem</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token keyword">null</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> encryptedValue <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>underlyingAdapter<span class="token punctuation">.</span><span class="token function">getItem</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>encryptedValue<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token function">decrypt</span><span class="token punctuation">(</span>encryptedValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token function">setItem</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> value<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> encryptedValue <span class="token operator">=</span> <span class="token function">encrypt</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>underlyingAdapter<span class="token punctuation">.</span><span class="token function">setItem</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> encryptedValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">removeItem</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>underlyingAdapter<span class="token punctuation">.</span><span class="token function">removeItem</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>underlyingAdapter<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="usage-7">Usage</h2>
<pre><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Component<span class="token punctuation">,</span> inject <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> storageSignal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> EncryptedAdapter <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./encrypted.adapter'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  selector<span class="token operator">:</span> <span class="token string">'app-secret-notes'</span><span class="token punctuation">,</span>
  standalone<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  template<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
    &lt;textarea 
      [value]="secret()" 
      (input)="secret.set($any($event.target).value)"
      placeholder="Type your secrets here...">
    &lt;/textarea>
    
    &lt;p>Check your LocalStorage! The value is scrambled.&lt;/p>
  </span><span class="token template-punctuation string">\`</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">SecretNotesComponent</span> <span class="token punctuation">{</span>
  <span class="token keyword">private</span> encryptedAdapter <span class="token operator">=</span> <span class="token function">inject</span><span class="token punctuation">(</span>EncryptedAdapter<span class="token punctuation">)</span><span class="token punctuation">;</span>

  secret <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    key<span class="token operator">:</span> <span class="token string">'my_secret_note'</span><span class="token punctuation">,</span>
    initial<span class="token operator">:</span> <span class="token string">''</span><span class="token punctuation">,</span>
    adapter<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>encryptedAdapter
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="decorator-pattern-with-dependency-injection-1">Decorator Pattern with Dependency Injection</h2>
<p>To make this truly reusable for <em>any</em> adapter (e.g., Encrypted IndexedDB), you can use Angular&#39;s DI system.</p><pre><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> InjectionToken<span class="token punctuation">,</span> Injectable<span class="token punctuation">,</span> Inject <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> StorageAdapter <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token constant">UNDERLYING_ADAPTER</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">InjectionToken<span class="token operator">&lt;</span>StorageAdapter<span class="token operator">></span></span><span class="token punctuation">(</span><span class="token string">'UNDERLYING_ADAPTER'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Injectable</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">GenericEncryptedAdapter</span> <span class="token keyword">implements</span> <span class="token class-name">StorageAdapter</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token decorator"><span class="token at operator">@</span><span class="token function">Inject</span></span><span class="token punctuation">(</span><span class="token constant">UNDERLYING_ADAPTER</span><span class="token punctuation">)</span> <span class="token keyword">private</span> adapter<span class="token operator">:</span> StorageAdapter<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token keyword">get</span> <span class="token function">isAsync</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>adapter<span class="token punctuation">.</span>isAsync<span class="token punctuation">;</span> <span class="token punctuation">}</span>

  <span class="token function">getItem</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>adapter<span class="token punctuation">.</span><span class="token function">getItem</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// Handle both sync and async results...</span>
    <span class="token comment">// (Implementation omitted for brevity, but involves checking if result is Promise)</span>
    <span class="token keyword">return</span> result<span class="token punctuation">;</span> 
  <span class="token punctuation">}</span>
  
  <span class="token comment">// ... implement other methods</span>
<span class="token punctuation">}</span>
</code></pre>`;export{n as default};
