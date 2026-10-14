import"./modulepreload-polyfill-P2Xu9kJm.js";(function(){let e={brand:`Vanvi Moments`,to:`Anvi`,from:`Anubhav`,date:`2016-12-08`,theme:`ivory`,isPublished:!1,headline:`To My *Favourite* Person`,opening:`A little celebration of us.`,firstCaption:`Where it all began ✦`,letterGreeting:`My love,`,letterBody:`If I could relive all the little moments that brought us here, I'd choose them again.

The laughs, the random conversations, the days that didn't go as planned, and all the moments when just having you around made everything better.

Thank you for being part of my life.

Thank you for the memories we've made, the things we've learned, and the little ways we've grown together.

*You are still one of my favourite parts of every day.*

Happy Anniversary, my love.

Here's to everything we've been, everything we are, and all the beautiful little moments still waiting for us.`,letterClosing:`With all my love, always`,statement:`You. Me. Our little *forever.*`,finaleMessage:`If I could make one wish for us, it would be for a thousand more ordinary days together.

More laughter.
More late-night conversations.
More little adventures.
More memories we haven't made yet.

I'd love to keep writing this story with you.`,finalLine:`Somehow, in this huge world, I found you.`,finalMessage:`And I'd still choose you.`,heroPhoto:`./assets/images/where_it_began.jpg`,photos:[{url:`./assets/images/polaroid1.jpg`,title:`Our First Picture`,caption:`A little moment that became a forever favourite.`},{url:`./assets/images/polaroid2.jpg`,title:`Our Happiest Days`,caption:`The kind of happiness I wish I could pause.`},{url:`./assets/images/polaroid3.jpg`,title:`Our Silly Moments`,caption:`Proof that we don't need a reason to laugh.`},{url:`./assets/images/polaroid4.jpg`,title:`My Favourite Memory`,caption:`One I'll always keep close to my heart.`}],milestones:[{title:`The First Hello`,text:`The beginning of something I didn't know would mean so much.`},{title:`The Moment It Changed`,text:`Somewhere along the way, you became my favourite person.`},{title:`The Day We Became Us`,text:`And suddenly, ordinary days had a little more magic.`}],reasons:[`The way you make ordinary days feel special.`,`Your smile, especially when you don't realize it.`,`The way you listen to my random stories.`,`How being around you feels like home.`,`Our inside jokes that nobody else understands.`,`The comfort of knowing you're there.`,`The way we keep learning about each other.`,`Simply because you're you.`],audioUrl:`https://cdn.cutiepage.in/template-seeds/cute-apology/music1-v2.mp3`,audioTitle:`Slow Bloom`},t={config:{...e},currentStep:0,isPlaying:!1,audio:null};function n(e){return e?e.replace(/\*(.*?)\*/g,`<em style="color:var(--theme-gold); font-style:italic;">$1</em>`):``}function r(e){if(!e)return`Countless Days`;let t=new Date(e),n=Math.abs(new Date-t);return`${Math.ceil(n/864e5).toLocaleString()} Days of Choosing You`}function i(){let i=t.config;document.body.setAttribute(`data-palette`,i.theme||`ivory`),new URLSearchParams(window.location.search).get(`published`)===`true`||localStorage.getItem(`vanvi_eternal_love_published`)===`true`||i.isPublished?document.body.classList.add(`is-published`):document.body.classList.remove(`is-published`);let a=document.getElementById(`dispDaysCount`);a&&(a.textContent=r(i.date));let o=document.getElementById(`dispHeadline`);o&&(o.innerHTML=n(i.headline||e.headline));let s=document.getElementById(`dispOpening`);s&&(s.textContent=i.opening||e.opening);let c=document.getElementById(`dispHeroPhoto`);c&&i.heroPhoto&&(c.src=i.heroPhoto);let l=document.getElementById(`dispFirstCaption`);l&&(l.textContent=i.firstCaption||e.firstCaption);let u=document.getElementById(`milestonesList`);u&&Array.isArray(i.milestones)&&(u.innerHTML=i.milestones.map((e,t)=>`
        <div class="milestone-item">
          <div class="milestone-marker">${t+1}</div>
          <div class="milestone-content">
            <h4>${e.title}</h4>
            <p>${e.text}</p>
          </div>
        </div>
      `).join(``));let d=document.getElementById(`polaroidStack`);d&&Array.isArray(i.photos)&&(d.innerHTML=i.photos.map(e=>`
        <div class="polaroid-frame">
          <img src="${e.url}" alt="${e.title}" class="polaroid-img" />
          <div class="polaroid-caption-box">
            <h4>${e.title}</h4>
            <p>${e.caption}</p>
          </div>
        </div>
      `).join(``));let f=document.getElementById(`reasonsContainer`);f&&Array.isArray(i.reasons)&&(f.innerHTML=i.reasons.map((e,t)=>`
        <div class="reason-card-pill">
          <span class="reason-number">#${t+1}</span>
          <span class="reason-text">${e}</span>
        </div>
      `).join(``));let p=document.getElementById(`dispLetterGreeting`);p&&(p.textContent=i.letterGreeting||`To ${i.to||`My Love`},`);let m=document.getElementById(`dispLetterBody`);m&&(m.innerHTML=n(i.letterBody||e.letterBody));let h=document.getElementById(`dispLetterClosing`);h&&(h.textContent=i.letterClosing||`Yours always, ${i.from||`Me`}`);let g=document.getElementById(`dispStatement`);g&&(g.innerHTML=n(i.statement||e.statement));let _=document.getElementById(`dispFinaleMessage`);_&&(_.textContent=i.finaleMessage||e.finaleMessage);let v=document.getElementById(`dispFinalLine`);v&&(v.textContent=i.finalLine||e.finalLine);let y=document.getElementById(`dispFinalMessage`);y&&(y.textContent=i.finalMessage||e.finalMessage)}function a(e){t.currentStep=e,document.querySelectorAll(`.chapter-screen`).forEach((t,n)=>{t.classList.toggle(`active`,n===e)}),document.querySelectorAll(`.step-dot`).forEach((t,n)=>{t.classList.toggle(`active`,n===e)}),window.scrollTo({top:0,behavior:`smooth`})}function o(){t.audio=new Audio(t.config.audioUrl),t.audio.loop=!0;let e=document.getElementById(`btnAudioToggle`);document.getElementById(`audioBars`),e&&e.addEventListener(`click`,()=>{t.isPlaying?(t.audio.pause(),t.isPlaying=!1,e.classList.remove(`audio-playing`)):t.audio.play().then(()=>{t.isPlaying=!0,e.classList.add(`audio-playing`)}).catch(e=>console.log(`Audio play blocked:`,e))})}function s(){let e=document.getElementById(`btnOpenInvitation`);e&&e.addEventListener(`click`,()=>{!t.isPlaying&&t.audio&&t.audio.play().then(()=>{t.isPlaying=!0;let e=document.getElementById(`btnAudioToggle`);e&&e.classList.add(`audio-playing`)}).catch(()=>{}),a(1)}),document.querySelectorAll(`.step-dot`).forEach(e=>{e.addEventListener(`click`,e=>{a(parseInt(e.target.getAttribute(`data-step`),10))})}),document.querySelectorAll(`.chapter-nav-btn`).forEach(e=>{e.addEventListener(`click`,e=>{a(parseInt(e.currentTarget.getAttribute(`data-next`),10))})});let n=document.getElementById(`btnCelebrate`);n&&n.addEventListener(`click`,()=>{window.confetti&&window.confetti({particleCount:100,spread:70,origin:{y:.6},colors:[`#c59b27`,`#e8c987`,`#d84b5a`,`#ffffff`]});let e=document.getElementById(`celebrateRevealed`);e&&e.classList.add(`revealed`),n.innerHTML=`<span>🥂 Forever & Always</span>`})}window.addEventListener(`message`,e=>{e.data&&e.data.type===`VANVI_CONFIG_UPDATE`&&(t.config={...t.config,...e.data.config},i())}),document.addEventListener(`DOMContentLoaded`,()=>{let n=new URLSearchParams(window.location.search).get(`data`);if(n)try{let r=JSON.parse(decodeURIComponent(escape(atob(n))));t.config={...e,...r}}catch{}i(),o(),s()})})();