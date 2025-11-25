const n=`---
title: SessionStorage Adapter
---

<h1 id="sessionstorage-adapter">SessionStorage Adapter</h1>
<p>The <strong>sessionStorage</strong> adapter provides temporary storage that lasts only for the current browser session. Data is cleared when the tab or browser is closed.</p><h2 id="overview-1">Overview</h2>
<p>SessionStorage is ideal for:</p><ul>
<li>Temporary form data</li>
<li>Current session state</li>
<li>Shopping session data</li>
<li>Wizard/multi-step form progress</li>
<li>Data that shouldn&#39;t persist between visits</li>
</ul>
<h2 id="basic-usage-1">Basic Usage</h2>
<p>To use sessionStorage, specify the <code>adapter</code> option:</p><pre><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Component <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> storageSignal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  selector<span class="token operator">:</span> <span class="token string">'app-checkout'</span><span class="token punctuation">,</span>
  standalone<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  template<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
    &lt;div class="checkout-wizard">
      &lt;h2>Checkout - Step {{ checkoutState().currentStep }}&lt;/h2>
      
      &lt;div *ngIf="checkoutState().currentStep === 1">
        &lt;h3>Shipping Information&lt;/h3>
        &lt;!-- Step 1 form -->
      &lt;/div>
      
      &lt;div *ngIf="checkoutState().currentStep === 2">
        &lt;h3>Payment&lt;/h3>
        &lt;!-- Step 2 form -->
      &lt;/div>
    &lt;/div>
  </span><span class="token template-punctuation string">\`</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">CheckoutComponent</span> <span class="token punctuation">{</span>
  checkoutState <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    key<span class="token operator">:</span> <span class="token string">'checkout-progress'</span><span class="token punctuation">,</span>
    initial<span class="token operator">:</span> <span class="token punctuation">{</span>
      currentStep<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
      shippingInfo<span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
      paymentInfo<span class="token operator">:</span> <span class="token keyword">null</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    adapter<span class="token operator">:</span> <span class="token string">'session'</span> <span class="token comment">// Use sessionStorage</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">nextStep</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>checkoutState<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>state <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token operator">...</span>state<span class="token punctuation">,</span>
      currentStep<span class="token operator">:</span> state<span class="token punctuation">.</span>currentStep <span class="token operator">+</span> <span class="token number">1</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="use-cases-1">Use Cases</h2>
<h3 id="1-multi-step-forms">1. Multi-Step Forms</h3>
<p>Perfect for saving progress in multi-step forms:</p><pre><code class="language-typescript"><span class="token keyword">const</span> formProgress <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  key<span class="token operator">:</span> <span class="token string">'form-wizard'</span><span class="token punctuation">,</span>
  initial<span class="token operator">:</span> <span class="token punctuation">{</span>
    step<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    data<span class="token operator">:</span> <span class="token punctuation">{</span>
      personalInfo<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
      addressInfo<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
      paymentInfo<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  adapter<span class="token operator">:</span> <span class="token string">'session'</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><h3 id="2-temporary-filters">2. Temporary Filters</h3>
<p>Store temporary search/filter state:</p><pre><code class="language-typescript"><span class="token keyword">const</span> searchFilters <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  key<span class="token operator">:</span> <span class="token string">'product-filters'</span><span class="token punctuation">,</span>
  initial<span class="token operator">:</span> <span class="token punctuation">{</span>
    category<span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    priceRange<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    sortBy<span class="token operator">:</span> <span class="token string">'relevance'</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  adapter<span class="token operator">:</span> <span class="token string">'session'</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><h3 id="3-active-tab-state">3. Active Tab State</h3>
<p>Track which tab is active in a session:</p><pre><code class="language-typescript"><span class="token keyword">const</span> activeTab <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  key<span class="token operator">:</span> <span class="token string">'active-tab'</span><span class="token punctuation">,</span>
  initial<span class="token operator">:</span> <span class="token string">'overview'</span><span class="token punctuation">,</span>
  adapter<span class="token operator">:</span> <span class="token string">'session'</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><h2 id="sessionstorage-vs-localstorage">SessionStorage vs LocalStorage</h2>
<table>
<thead>
<tr>
<th align="left">Feature</th>
<th align="left">SessionStorage</th>
<th align="left">LocalStorage</th>
</tr>
</thead>
<tbody><tr>
<td align="left"><strong>Persistence</strong></td>
<td align="left">Until tab/browser closes</td>
<td align="left">Indefinite</td>
</tr>
<tr>
<td align="left"><strong>Scope</strong></td>
<td align="left">Per tab/window</td>
<td align="left">Shared across tabs</td>
</tr>
<tr>
<td align="left"><strong>Use Case</strong></td>
<td align="left">Temporary session data</td>
<td align="left">Long-term preferences</td>
</tr>
<tr>
<td align="left"><strong>Size Limit</strong></td>
<td align="left">~5-10 MB</td>
<td align="left">~5-10 MB</td>
</tr>
<tr>
<td align="left"><strong>Privacy</strong></td>
<td align="left">Auto-cleared on exit</td>
<td align="left">Manual clearing needed</td>
</tr>
</tbody></table>
<h2 id="example-session-specific-cart">Example: Session-Specific Cart</h2>
<p>Here&#39;s an example of a shopping cart that&#39;s specific to the current session:</p><pre><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Component<span class="token punctuation">,</span> signal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> storageSignal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>

<span class="token keyword">interface</span> <span class="token class-name">CartItem</span> <span class="token punctuation">{</span>
  id<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
  name<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
  quantity<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
  price<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  selector<span class="token operator">:</span> <span class="token string">'app-shopping-cart'</span><span class="token punctuation">,</span>
  standalone<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  template<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
    &lt;div class="cart">
      &lt;h2>Shopping Cart (Session)&lt;/h2>
      &lt;p>Items will be cleared when you close this tab&lt;/p>
      
      &lt;ul>
        &lt;li *ngFor="let item of cart()">
          {{ item.name }} - {{ item.quantity }}x </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token punctuation">{</span> item<span class="token punctuation">.</span>price <span class="token punctuation">}</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">
          &lt;button (click)="removeItem(item.id)">Remove&lt;/button>
        &lt;/li>
      &lt;/ul>
      
      &lt;p>Total: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token punctuation">{</span> <span class="token function">total</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&lt;/p>
    &lt;/div>
  </span><span class="token template-punctuation string">\`</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">ShoppingCartComponent</span> <span class="token punctuation">{</span>
  cart <span class="token operator">=</span> <span class="token generic-function"><span class="token function">storageSignal</span><span class="token generic class-name"><span class="token operator">&lt;</span>CartItem<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">></span></span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    key<span class="token operator">:</span> <span class="token string">'session-cart'</span><span class="token punctuation">,</span>
    initial<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    adapter<span class="token operator">:</span> <span class="token string">'session'</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  total <span class="token operator">=</span> <span class="token function">signal</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">addItem</span><span class="token punctuation">(</span>item<span class="token operator">:</span> CartItem<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>cart<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>items <span class="token operator">=></span> <span class="token punctuation">[</span><span class="token operator">...</span>items<span class="token punctuation">,</span> item<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">updateTotal</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">removeItem</span><span class="token punctuation">(</span>id<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>cart<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>items <span class="token operator">=></span> items<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>i <span class="token operator">=></span> i<span class="token punctuation">.</span>id <span class="token operator">!==</span> id<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">updateTotal</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token function">updateTotal</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> sum <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">cart</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">reduce</span><span class="token punctuation">(</span><span class="token punctuation">(</span>acc<span class="token punctuation">,</span> item<span class="token punctuation">)</span> <span class="token operator">=></span> 
      acc <span class="token operator">+</span> <span class="token punctuation">(</span>item<span class="token punctuation">.</span>price <span class="token operator">*</span> item<span class="token punctuation">.</span>quantity<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">0</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>total<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>sum<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="clearing-session-data">Clearing Session Data</h2>
<p>Session data is automatically cleared when the browser tab closes, but you can also manually clear it:</p><pre><code class="language-typescript"><span class="token keyword">const</span> sessionData <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  key<span class="token operator">:</span> <span class="token string">'temp-data'</span><span class="token punctuation">,</span>
  initial<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  adapter<span class="token operator">:</span> <span class="token string">'session'</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// Manually clear</span>
sessionData<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><h2 id="browser-compatibility-1">Browser Compatibility</h2>
<p>SessionStorage is supported in all modern browsers:</p><ul>
<li>✅ Chrome, Edge, Firefox, Safari</li>
<li>✅ Mobile browsers</li>
<li>✅ Works in Private/Incognito mode (but cleared on exit)</li>
<li>❌ Not available in Web Workers</li>
</ul>
<h2 id="best-practices-2">Best Practices</h2>
<ol>
<li><strong>Use for temporary data only</strong> - Don&#39;t rely on sessionStorage for critical data</li>
<li><strong>Provide fallbacks</strong> - Always have a default initial value</li>
<li><strong>Clear on logout</strong> - Explicitly clear sensitive session data when users log out</li>
</ol>
<pre><code class="language-typescript"><span class="token comment">// Clear all session data on logout</span>
<span class="token keyword">function</span> <span class="token function">logout</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  sessionData<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  userSession<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// ... other cleanup</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="next-steps-1">Next Steps</h2>
<ul>
<li>Compare with <a href="/local-storage">LocalStorage</a> for persistent data</li>
<li>Learn about <a href="/custom-adapters">Custom Adapters</a> for advanced storage</li>
</ul>
`;export{n as default};
