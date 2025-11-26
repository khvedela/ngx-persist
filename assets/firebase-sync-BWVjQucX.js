const n=`---
title: Firebase Sync Adapter
---

<h1 id="firebase-sync-adapter-1">Firebase Sync Adapter</h1>
<p>This example demonstrates how to use Google Firebase (Firestore) as a storage backend. This enables real-time synchronization across all user devices.</p><h2 id="implementation-6">Implementation</h2>
<p>We will use <code>@angular/fire</code> to interact with Firestore. We&#39;ll implement the <code>subscribe</code> method to listen for real-time changes from the database.</p><pre><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Injectable<span class="token punctuation">,</span> inject <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Firestore<span class="token punctuation">,</span> doc<span class="token punctuation">,</span> getDoc<span class="token punctuation">,</span> setDoc<span class="token punctuation">,</span> deleteDoc<span class="token punctuation">,</span> onSnapshot<span class="token punctuation">,</span> collection <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/fire/firestore'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Auth <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/fire/auth'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> StorageAdapter <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Injectable</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span> providedIn<span class="token operator">:</span> <span class="token string">'root'</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">FirestoreAdapter</span> <span class="token keyword">implements</span> <span class="token class-name">StorageAdapter</span> <span class="token punctuation">{</span>
  <span class="token keyword">readonly</span> isAsync <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
  <span class="token keyword">private</span> firestore <span class="token operator">=</span> <span class="token function">inject</span><span class="token punctuation">(</span>Firestore<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">private</span> auth <span class="token operator">=</span> <span class="token function">inject</span><span class="token punctuation">(</span>Auth<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">private</span> <span class="token function">getDocRef</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> userId <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>auth<span class="token punctuation">.</span>currentUser<span class="token operator">?.</span>uid<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>userId<span class="token punctuation">)</span> <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">'User must be logged in to save settings'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    
    <span class="token comment">// Store settings in a sub-collection of the user document</span>
    <span class="token keyword">return</span> <span class="token function">doc</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>firestore<span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">users/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>userId<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/settings/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>key<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">async</span> <span class="token function">getItem</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token builtin">string</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token operator">></span> <span class="token punctuation">{</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> snap <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">getDoc</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getDocRef</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> snap<span class="token punctuation">.</span><span class="token function">exists</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token punctuation">(</span>snap<span class="token punctuation">.</span><span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token string">'value'</span><span class="token punctuation">]</span> <span class="token keyword">as</span> <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">async</span> <span class="token function">setItem</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span> value<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token operator">></span> <span class="token punctuation">{</span>
    <span class="token keyword">await</span> <span class="token function">setDoc</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getDocRef</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> value <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">async</span> <span class="token function">removeItem</span><span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token operator">></span> <span class="token punctuation">{</span>
    <span class="token keyword">await</span> <span class="token function">deleteDoc</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getDocRef</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">/**
   * Listen for real-time changes from Firestore.
   * When another device updates the setting, this callback fires,
   * and the signal automatically updates.
   */</span>
  <span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token function-variable function">listener</span><span class="token operator">:</span> <span class="token punctuation">(</span>key<span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
    <span class="token comment">// Note: In a real app, you might want to manage subscriptions more granularly</span>
    <span class="token comment">// or listen to the entire 'settings' collection instead of individual documents.</span>
    <span class="token comment">// This is a simplified example.</span>
    
    <span class="token comment">// For this example, we aren't subscribing to a single key here because</span>
    <span class="token comment">// the interface expects a generic listener.</span>
    <span class="token comment">// A robust implementation might listen to the collection:</span>
    
    <span class="token keyword">const</span> userId <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>auth<span class="token punctuation">.</span>currentUser<span class="token operator">?.</span>uid<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>userId<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

    <span class="token keyword">const</span> collectionRef <span class="token operator">=</span> <span class="token function">collection</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>firestore<span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">users/</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>userId<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">/settings</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    
    <span class="token keyword">const</span> unsubscribe <span class="token operator">=</span> <span class="token function">onSnapshot</span><span class="token punctuation">(</span>collectionRef<span class="token punctuation">,</span> <span class="token punctuation">(</span>snapshot<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      snapshot<span class="token punctuation">.</span><span class="token function">docChanges</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>change<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>change<span class="token punctuation">.</span>type <span class="token operator">===</span> <span class="token string">'modified'</span> <span class="token operator">||</span> change<span class="token punctuation">.</span>type <span class="token operator">===</span> <span class="token string">'added'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
           <span class="token comment">// We notify that a key has changed. </span>
           <span class="token comment">// The library will then re-fetch the value (calling getItem).</span>
           <span class="token comment">// Optimization: You could potentially cache the value here to avoid the extra fetch,</span>
           <span class="token comment">// but the standard flow is to notify -> re-fetch.</span>
           <span class="token function">listener</span><span class="token punctuation">(</span>change<span class="token punctuation">.</span>doc<span class="token punctuation">.</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">return</span> unsubscribe<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><h2 id="usage-10">Usage</h2>
<pre><code class="language-typescript"><span class="token keyword">import</span> <span class="token punctuation">{</span> Component<span class="token punctuation">,</span> inject<span class="token punctuation">,</span> effect <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Auth<span class="token punctuation">,</span> user <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/fire/auth'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> storageSignal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'ngx-persist'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> FirestoreAdapter <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'./firestore.adapter'</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  selector<span class="token operator">:</span> <span class="token string">'app-dashboard'</span><span class="token punctuation">,</span>
  standalone<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  template<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
    @if (user$ | async) {
      &lt;h1>Welcome, {{ (user$ | async)?.displayName }}&lt;/h1>
      
      &lt;label>
        Dashboard Layout:
        &lt;select [value]="layout()" (change)="layout.set($any($event.target).value)">
          &lt;option value="grid">Grid&lt;/option>
          &lt;option value="list">List&lt;/option>
        &lt;/select>
      &lt;/label>
    } @else {
      &lt;p>Please log in to sync settings.&lt;/p>
    }
  </span><span class="token template-punctuation string">\`</span></span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">DashboardComponent</span> <span class="token punctuation">{</span>
  <span class="token keyword">private</span> auth <span class="token operator">=</span> <span class="token function">inject</span><span class="token punctuation">(</span>Auth<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">private</span> firestoreAdapter <span class="token operator">=</span> <span class="token function">inject</span><span class="token punctuation">(</span>FirestoreAdapter<span class="token punctuation">)</span><span class="token punctuation">;</span>
  
  user$ <span class="token operator">=</span> <span class="token function">user</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>auth<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// This signal will sync in real-time!</span>
  layout <span class="token operator">=</span> <span class="token function">storageSignal</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    key<span class="token operator">:</span> <span class="token string">'dashboard_layout'</span><span class="token punctuation">,</span>
    initial<span class="token operator">:</span> <span class="token string">'grid'</span><span class="token punctuation">,</span>
    adapter<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>firestoreAdapter
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>`;export{n as default};
