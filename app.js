document.addEventListener('DOMContentLoaded',function(){
  var ham=document.querySelector('.dz-hamburger'),nav=document.querySelector('.dz-nav');
  if(ham&&nav){ham.addEventListener('click',function(){var open=nav.classList.toggle('open');ham.textContent=open?'✕':'☰';});}

  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -8% 0px'}):null;
  document.querySelectorAll('main section').forEach(function(el,i){el.classList.add('reveal');el.style.transitionDelay=Math.min(i,3)*60+'ms';if(io){io.observe(el);}else{el.classList.add('in');}});

  var hero=document.querySelectorAll('.h-anim');
  if(hero.length){requestAnimationFrame(function(){requestAnimationFrame(function(){hero.forEach(function(e){e.classList.add('in');});});});setTimeout(function(){hero.forEach(function(e){if(getComputedStyle(e).opacity!=='1'){e.style.transition='none';e.style.opacity='1';e.style.transform='none';}});},1600);}

  var slides=[].slice.call(document.querySelectorAll('.gal-slide'));
  if(slides.length){
    var thumbs=[].slice.call(document.querySelectorAll('.gal-thumb')),counter=document.querySelector('.gal-counter'),idx=0;
    function show(i){idx=(i%slides.length+slides.length)%slides.length;slides.forEach(function(s,j){s.style.opacity=j===idx?'1':'0';});thumbs.forEach(function(t,j){t.classList.toggle('active',j===idx);});if(counter){counter.textContent=(idx+1)+' / '+slides.length;}}
    var pv=document.querySelector('.gal-prev'),nx=document.querySelector('.gal-next');
    if(pv){pv.addEventListener('click',function(){show(idx-1);});}
    if(nx){nx.addEventListener('click',function(){show(idx+1);});}
    thumbs.forEach(function(t,j){t.addEventListener('click',function(){show(j);});});
    show(0);
  }

  document.querySelectorAll('form[data-success]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var s=document.querySelector(f.getAttribute('data-success'));
      f.style.display='none';
      if(s){s.style.display='block';window.scrollTo({top:s.getBoundingClientRect().top+window.scrollY-120,behavior:'smooth'});}
    });
  });
});