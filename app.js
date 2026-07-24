(function(){
  var RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn){ if(document.readyState!=='loading'){fn();} else {document.addEventListener('DOMContentLoaded',fn);} }

  ready(function(){
    /* ---------- mobilni meni ---------- */
    var ham=document.querySelector('.dz-hamburger'), nav=document.querySelector('.dz-nav');
    if(ham&&nav){ham.addEventListener('click',function(){var open=nav.classList.toggle('open');ham.textContent=open?'\u2715':'\u2630';});}

    /* ---------- sticky header shrink ---------- */
    var header=document.querySelector('header'), ticking=false;
    if(header){
      var onScroll=function(){header.classList.toggle('scrolled', window.scrollY>40);ticking=false;};
      window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});
      onScroll();
    }

    /* ---------- jedan IntersectionObserver za reveal + rise + route-line ---------- */
    var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ revealEl(e.target); io.unobserve(e.target); } });
    },{threshold:0.12, rootMargin:'0px 0px -8% 0px'}) : null;

    function revealEl(el){
      el.classList.add('in');
      var rc=el.querySelectorAll ? el.querySelectorAll('.rise') : [];
      [].forEach.call(rc,function(c){ c.classList.add('in'); });
      if(el.classList && el.classList.contains('drive-in')){
        var im=el.querySelector('.veh-img'), cp=el.querySelector('.veh-cap');
        if(im){im.style.opacity='1';im.style.transform='none';}
        if(cp){cp.style.opacity='1';cp.style.transform='none';}
      }
      var cnts=el.querySelectorAll ? el.querySelectorAll('.count') : [];
      [].forEach.call(cnts, countUp);
    }

    function countUp(elm){
      if(elm.dataset.counted) return;
      elm.dataset.counted='1';
      var target=parseFloat(elm.getAttribute('data-count'))||0;
      var suf=elm.getAttribute('data-suffix')||'';
      if(RM){ elm.textContent=target+suf; return; }
      var dur=1400, t0=null;
      function step(ts){
        if(!t0) t0=ts;
        var p=Math.min((ts-t0)/dur,1);
        var eased=1-Math.pow(1-p,3);
        elm.textContent=Math.round(target*eased)+suf;
        if(p<1) requestAnimationFrame(step); else elm.textContent=target+suf;
      }
      elm.textContent='0'+suf;
      requestAnimationFrame(step);
    }
    function observe(el){ if(io){io.observe(el);} else { revealEl(el); } }

    /* sekcije: whole-section reveal ili card-stagger (okinuto iz istog observera) */
    var secs=[].slice.call(document.querySelectorAll('main section'));
    secs.forEach(function(sec){
      var cards=[].slice.call(sec.querySelectorAll('[style*="border:1px solid #e6ebf3"], [style*="border: 1px solid #e6ebf3"]')).filter(function(c){ return !c.classList.contains('card-skip'); });
      cards.forEach(function(c){ c.classList.add('card-mi'); });
      if(cards.length>=3 && !RM){
        cards.forEach(function(c,i){ if(c.classList.contains('drive-in')) return; c.classList.add('rise'); c.style.transitionDelay=Math.min(i,6)*70+'ms'; });
      } else {
        sec.classList.add('reveal');
      }
      observe(sec);
    });

    /* vozni park: svako vozilo se "dovozi" (slika s leve, naziv gore) */
    var driveIns=[].slice.call(document.querySelectorAll('.drive-in'));
    var mobileDI = window.innerWidth<=768;
    driveIns.forEach(function(c,i){
      var im=c.querySelector('.veh-img'), cp=c.querySelector('.veh-cap');
      if(!RM){
        var d=Math.min(i,6)*90;
        if(im){im.style.opacity='0';im.style.transform='translateX('+(mobileDI?-22:-46)+'px)';im.style.transitionDelay=d+'ms';}
        if(cp){cp.style.opacity='0';cp.style.transform='translateY(12px)';cp.style.transitionDelay=(d+180)+'ms';}
      }
      observe(c);
    });

    /* safety net: ako observer iz bilo kog razloga ne okine, sadržaj se ipak prikaže */
    setTimeout(function(){
      [].slice.call(document.querySelectorAll('.reveal:not(.in),.rise:not(.in),.drive-in:not(.in)')).forEach(function(el){
        var r=el.getBoundingClientRect();
        if(r.top < window.innerHeight){ el.style.transition='none'; el.classList.add('in'); }
      });
    }, 2600);

    /* strelice u karticama -> pomeranje na hover (klasa) */
    [].slice.call(document.querySelectorAll('.card-mi')).forEach(function(c){
      // pretvori zavrsni "→" span u pomerljivu strelicu ako postoji
      var spans=c.querySelectorAll('span');
      spans.forEach(function(s){ if(s.textContent.trim().indexOf('\u2192')>-1 && s.children.length===0){ s.classList.add('card-arrow'); } });
    });

    /* kontakt redovi (telefon/email/adresa) -> blagi pomak na hover */
    [].slice.call(document.querySelectorAll('a[href^="tel:"],a[href^="mailto:"]')).forEach(function(a){
      var row=a.closest('div'); if(row && row.parentElement && /flex-direction:column/.test(row.parentElement.getAttribute('style')||'')){ row.classList.add('contact-row'); }
    });

    /* ---------- hero ulaz (samo prvi put) ---------- */
    var hero=[].slice.call(document.querySelectorAll('.h-anim'));
    if(hero.length){
      requestAnimationFrame(function(){requestAnimationFrame(function(){hero.forEach(function(e){e.classList.add('in');});});});
      setTimeout(function(){hero.forEach(function(e){ if(getComputedStyle(e).opacity!=='1'){e.style.transition='none';e.style.opacity='1';e.style.transform='none';} });},1600);
    }

    /* ---------- animirana "trasa" linija ispod naslova ---------- */
    function addRouteLine(afterEl){
      if(!afterEl) return;
      var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('class','route-line');
      svg.setAttribute('width','130'); svg.setAttribute('height','8');
      svg.setAttribute('viewBox','0 0 130 8'); svg.setAttribute('aria-hidden','true');
      var p=document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('d','M2 4 H128'); p.setAttribute('pathLength','1');
      svg.appendChild(p);
      afterEl.parentNode.insertBefore(svg, afterEl.nextSibling);
      observe(svg);
    }
    // ispod glavnog H1 (page hero) i ispod prvog H2 na početnoj
    addRouteLine(document.querySelector('main h1'));
    var homeH2=document.querySelector('main section h2');
    if(homeH2 && document.body.getAttribute('data-nothome')===null){ /* dodaj i na home podnaslov usluga */ }

    /* ---------- galerija slajder ---------- */
    var slides=[].slice.call(document.querySelectorAll('.gal-slide'));
    if(slides.length){
      var thumbs=[].slice.call(document.querySelectorAll('.gal-thumb')), counter=document.querySelector('.gal-counter'), idx=0;
      function show(i){ idx=(i%slides.length+slides.length)%slides.length; slides.forEach(function(s,j){s.style.opacity=j===idx?'1':'0';}); thumbs.forEach(function(t,j){t.classList.toggle('active',j===idx);}); if(counter){counter.textContent=(idx+1)+' / '+slides.length;} }
      var pv=document.querySelector('.gal-prev'), nx=document.querySelector('.gal-next');
      if(pv){pv.addEventListener('click',function(){show(idx-1);});}
      if(nx){nx.addEventListener('click',function(){show(idx+1);});}
      thumbs.forEach(function(t,j){t.addEventListener('click',function(){show(j);});});
      show(0);
    }

    /* ---------- forme: uspešna poruka ---------- */
    document.querySelectorAll('form[data-success]').forEach(function(f){
      f.addEventListener('submit',function(e){
        e.preventDefault();
        var s=document.querySelector(f.getAttribute('data-success'));
        f.style.display='none';
        if(s){ s.style.display='block'; window.scrollTo({top:s.getBoundingClientRect().top+window.scrollY-120, behavior: RM?'auto':'smooth'}); }
      });
    });

    /* ---------- tilt efekat na karticama (gravitate) ---------- */
    var canTilt = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if(canTilt && !RM){
      var tiltEls=[].slice.call(document.querySelectorAll('.drive-in'));
      tiltEls.forEach(function(el){
        el.classList.add('tilt');
        var raf=null;
        el.addEventListener('mousemove',function(e){
          if(raf) return;
          raf=requestAnimationFrame(function(){
            raf=null;
            var r=el.getBoundingClientRect();
            var px=(e.clientX-r.left)/r.width-0.5;
            var py=(e.clientY-r.top)/r.height-0.5;
            var rx=(-py*7).toFixed(2), ry=(px*7).toFixed(2);
            el.style.setProperty('transform','perspective(900px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-4px)','important');
            el.style.setProperty('transition','transform .12s ease-out, border-color .22s ease, box-shadow .22s ease','important');
          });
        });
        el.addEventListener('mouseleave',function(){
          el.style.setProperty('transition','transform .45s cubic-bezier(.22,.61,.36,1), border-color .22s ease, box-shadow .22s ease','important');
          el.style.setProperty('transform','perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)','important');
        });
      });
    }

    /* ---------- text-rotate: rotiraju\u0107a re\u010d u naslovu ---------- */
    var rw=document.querySelector('.rotate-word');
    if(rw){
      var words=(rw.getAttribute('data-words')||'').split(',').map(function(w){return w.trim();}).filter(Boolean);
      if(words.length>1 && !RM){
        // rezervi\u0161i \u0161irinu najdu\u017ee re\u010di da se layout ne pomera
        var probe=document.createElement('span');
        probe.style.cssText='position:absolute;visibility:hidden;white-space:pre;font:inherit;letter-spacing:inherit';
        rw.appendChild(probe);
        var maxW=0;
        words.forEach(function(w){ probe.textContent=w; maxW=Math.max(maxW, probe.offsetWidth); });
        probe.remove();
        if(maxW) rw.style.minWidth=Math.ceil(maxW)+'px';

        var wi=0, busy=false;
        function paint(word, dir, cb){
          rw.textContent='';
          var chars=word.split('');
          chars.forEach(function(ch,i){
            var sp=document.createElement('span');
            sp.className='rw-char';
            sp.textContent=ch;
            sp.style.transform='translateY('+(dir>0?'105%':'-105%')+')';
            sp.style.opacity='0';
            rw.appendChild(sp);
            requestAnimationFrame(function(){
              setTimeout(function(){
                sp.style.transition='transform .5s cubic-bezier(.22,.61,.36,1),opacity .35s ease';
                sp.style.transform='translateY(0)';
                sp.style.opacity='1';
                if(i===chars.length-1 && cb) setTimeout(cb, 520);
              }, i*26);
            });
          });
        }
        function exit(cb){
          var chars=[].slice.call(rw.querySelectorAll('.rw-char'));
          if(!chars.length){ cb(); return; }
          chars.forEach(function(sp,i){
            setTimeout(function(){
              sp.style.transition='transform .4s cubic-bezier(.55,.06,.68,.19),opacity .3s ease';
              sp.style.transform='translateY(-105%)';
              sp.style.opacity='0';
            }, i*20);
          });
          setTimeout(cb, chars.length*20+420);
        }
        // inicijalno: razlo\u017ei postoje\u0107u re\u010d na slova bez animacije
        (function initial(){
          var w=rw.textContent.trim();
          rw.textContent='';
          w.split('').forEach(function(ch){
            var sp=document.createElement('span');
            sp.className='rw-char'; sp.textContent=ch;
            rw.appendChild(sp);
          });
        })();
        setInterval(function(){
          if(busy) return; busy=true;
          exit(function(){
            wi=(wi+1)%words.length;
            paint(words[wi], 1, function(){ busy=false; });
          });
        }, 3200);
      }
    }

    /* ---------- sticky mobilni CTA ---------- */
    var cta=document.createElement('a');
    cta.className='sticky-cta';
    cta.href='tel:+38169712372';
    cta.setAttribute('aria-label','Pozovite auto-školu');
    cta.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"></path></svg><span>Pozovite auto-školu</span>';
    document.body.appendChild(cta);

    var pastHero=false, footerVisible=false;
    function syncCta(){
      var showIt = pastHero && !footerVisible;
      cta.classList.toggle('show', showIt);
      document.body.classList.toggle('sticky-pad', showIt);
    }
    if(io || 'IntersectionObserver' in window){
      var firstSec=document.querySelector('main section');
      var footer=document.querySelector('footer');
      var ctaIO=new IntersectionObserver(function(es){
        es.forEach(function(e){
          if(e.target===firstSec){ pastHero = !e.isIntersecting; }
          if(e.target===footer){ footerVisible = e.isIntersecting; }
        });
        syncCta();
      },{threshold:0, rootMargin:'0px 0px -10% 0px'});
      if(firstSec){ctaIO.observe(firstSec);}
      if(footer){ctaIO.observe(footer);}
    } else {
      // fallback: uvek dostupno na mobilnom
      window.addEventListener('scroll',function(){ pastHero=window.scrollY>300; syncCta(); },{passive:true});
    }
  });
})();
