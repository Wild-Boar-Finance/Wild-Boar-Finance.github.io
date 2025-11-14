const menuContentMap = {
    'menu1': 'apiContentStart',
    'menu2': 'apiContentCatalog', 
    'menu3': 'apiContentPolicy',
    'menu4': 'apiDefiIndex',
    'menu5': 'apiAltcoinIndex'
};

const menuContentMapMob = {
    'menu1mob': 'apiContentStart',
    'menu2mob': 'apiContentCatalog', 
    'menu3mob': 'apiContentPolicy',
    'menu4mob': 'apiDefiIndex',
    'menu5mob': 'apiAltcoinIndex'
};


function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' 
    });
}


function showContent(contentId) {

    const allContentIds = [...Object.values(menuContentMap), ...Object.values(menuContentMapMob)];
    const uniqueContentIds = [...new Set(allContentIds)];
    
    uniqueContentIds.forEach(blockId => {
        const block = document.getElementById(blockId);
        if (block) {
            block.style.display = 'none';
        }
    });
    

    const targetBlock = document.getElementById(contentId);
    if (targetBlock) {
        targetBlock.style.display = 'flex';
    }
    

    scrollToTop();
}


function activateMenuItems(contentId) {

    const allMenuIds = [...Object.keys(menuContentMap), ...Object.keys(menuContentMapMob)];
    
    allMenuIds.forEach(id => {
        const menuItem = document.getElementById(id);
        if (menuItem) {
            menuItem.classList.remove('active');
        }
    });
    
 
    Object.keys(menuContentMap).forEach(menuId => {
        if (menuContentMap[menuId] === contentId) {
            const menuItem = document.getElementById(menuId);
            if (menuItem) {
                menuItem.classList.add('active');
            }
        }
    });
    

    Object.keys(menuContentMapMob).forEach(menuId => {
        if (menuContentMapMob[menuId] === contentId) {
            const menuItem = document.getElementById(menuId);
            if (menuItem) {
                menuItem.classList.add('active');
            }
        }
    });
}


Object.keys(menuContentMap).forEach(menuId => {
    const menuItem = document.getElementById(menuId);
    if (menuItem) {
        menuItem.addEventListener('click', () => {
            const contentId = menuContentMap[menuId];
            showContent(contentId);
            activateMenuItems(contentId);
        });
    }
});


Object.keys(menuContentMapMob).forEach(menuId => {
    const menuItem = document.getElementById(menuId);
    if (menuItem) {
        menuItem.addEventListener('click', () => {
            const contentId = menuContentMapMob[menuId];
            showContent(contentId);
            activateMenuItems(contentId);
        });
    }
});


function syncMenuWithVisibleContent() {
    const contentIds = ['apiContentStart', 'apiContentCatalog', 'apiContentPolicy', 'apiDefiIndex', 'apiAltcoinIndex'];
    

    for (let contentId of contentIds) {
        const block = document.getElementById(contentId);
        if (block && (block.style.display === 'flex' || 
                     (block.style.display === '' && window.getComputedStyle(block).display === 'flex'))) {
            activateMenuItems(contentId);
            return;
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    showContent('apiContentStart');
    activateMenuItems('apiContentStart');
});


const observer = new MutationObserver(syncMenuWithVisibleContent);
observer.observe(document.body, { 
    subtree: true,
    attributes: true,
    attributeFilter: ['style']
});






document.addEventListener('DOMContentLoaded', function() {

    const defiTab1 = document.getElementById('defiTab1');
    const defiTab2 = document.getElementById('defiTab2');
    const defiTab3 = document.getElementById('defiTab3');
    
    const defiCurl = document.getElementById('defiCurl');
    const defiPython = document.getElementById('defiPython');
    const defiJavaScript = document.getElementById('defiJavaScript');
    

    if (!defiTab1 || !defiTab2 || !defiTab3 || !defiCurl || !defiPython || !defiJavaScript) {
        console.error('Не все элементы найдены на странице');
        return;
    }
    

    function resetAllTabsAndContent() {

        defiTab1.classList.remove('active');
        defiTab2.classList.remove('active');
        defiTab3.classList.remove('active');
        
  
        defiCurl.style.display = 'none';
        defiPython.style.display = 'none';
        defiJavaScript.style.display = 'none';
    }
    

    function activateTabAndContent(tab, content) {
        resetAllTabsAndContent();
        tab.classList.add('active');
        content.style.display = 'flex';
    }
    
   
    defiTab1.addEventListener('click', function() {
        activateTabAndContent(defiTab1, defiCurl);
    });
    
    defiTab2.addEventListener('click', function() {
        activateTabAndContent(defiTab2, defiPython);
    });
    
    defiTab3.addEventListener('click', function() {
        activateTabAndContent(defiTab3, defiJavaScript);
    });
    

    activateTabAndContent(defiTab1, defiCurl);
});




document.addEventListener('DOMContentLoaded', function() {

    const altcoinTab1 = document.getElementById('altcoinTab1');
    const altcoinTab2 = document.getElementById('altcoinTab2');
    const altcoinTab3 = document.getElementById('altcoinTab3');
    
    const altcoinCurl = document.getElementById('altcoinCurl');
    const altcoinPython = document.getElementById('altcoinPython');
    const altcoinJavaScript = document.getElementById('altcoinJavaScript');
    
 
    if (!altcoinTab1 || !altcoinTab2 || !altcoinTab3 || !altcoinCurl || !altcoinPython || !altcoinJavaScript) {
        console.error('Не все элементы найдены на странице');
        return;
    }
    

    function resetAllTabsAndContent() {

        altcoinTab1.classList.remove('active');
        altcoinTab2.classList.remove('active');
        altcoinTab3.classList.remove('active');
        

        altcoinCurl.style.display = 'none';
        altcoinPython.style.display = 'none';
        altcoinJavaScript.style.display = 'none';
    }
    

    function activateTabAndContent(tab, content) {
        resetAllTabsAndContent();
        tab.classList.add('active');
        content.style.display = 'flex';
    }
    

    altcoinTab1.addEventListener('click', function() {
        activateTabAndContent(altcoinTab1, altcoinCurl);
    });
    
    altcoinTab2.addEventListener('click', function() {
        activateTabAndContent(altcoinTab2, altcoinPython);
    });
    
    altcoinTab3.addEventListener('click', function() {
        activateTabAndContent(altcoinTab3, altcoinJavaScript);
    });
    

    activateTabAndContent(altcoinTab1, altcoinCurl);
});



document.getElementById('dropdownTrigger').addEventListener('click', function() {
  const menu = document.getElementById('mobileMenu');
  const icon = this.querySelector('img');
  

  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
  

  icon.classList.toggle('rotated');
  

  const isExpanded = menu.style.display === 'flex';
  this.setAttribute('aria-expanded', isExpanded);
});


document.addEventListener('click', function(event) {
  const dropdownTrigger = document.getElementById('dropdownTrigger');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (!dropdownTrigger.contains(event.target) && !mobileMenu.contains(event.target)) {
    mobileMenu.style.display = 'none';
    const icon = dropdownTrigger.querySelector('img');
    icon.classList.remove('rotated');
    dropdownTrigger.setAttribute('aria-expanded', 'false');
  }
});


['menu1mob', 'menu2mob', 'menu3mob', 'menu4mob', 'menu5mob'].forEach(menuId => {
  const menuItem = document.getElementById(menuId);
  if (menuItem) {
    menuItem.addEventListener('click', function() {
      const mobileMenu = document.getElementById('mobileMenu');
      const dropdownTrigger = document.getElementById('dropdownTrigger');
      const icon = dropdownTrigger.querySelector('img');
      
      mobileMenu.style.display = 'none';
      icon.classList.remove('rotated');
      dropdownTrigger.setAttribute('aria-expanded', 'false');
    });
  }
});


const menuTexts = {
  'menu1mob': 'Старт',
  'menu2mob': 'Каталог',
  'menu3mob': 'Политики',
  'menu4mob': 'DeFi Index',
  'menu5mob': 'Altcoin Index'
};


Object.keys(menuTexts).forEach(menuId => {
  const menuElement = document.getElementById(menuId);
  if (menuElement) {
    menuElement.addEventListener('click', function() {
      const textElement = document.querySelector('#dropdownTrigger .wbapi-sabmenu-item-txt');
      textElement.textContent = menuTexts[menuId];
    });
  }
});


function initStickyMenu() {
  const menu = document.querySelector('.wbapi-mob-menu');
  const trigger = document.querySelector('.wbapi-mob-menu-sticky-trigger');
  
  console.log('Menu element:', menu);
  console.log('Trigger element:', trigger);
  
  if (!menu) {
    console.error('Меню .wbapi-mob-menu не найдено!');
    return;
  }
  
  if (!trigger) {
    console.error('Триггер .wbapi-mob-menu-sticky-trigger не найден!');
    return;
  }
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        console.log('Trigger intersection:', entry.isIntersecting);
        if (!entry.isIntersecting) {
          menu.classList.add('sticky');
          console.log('Меню зафиксировано');
        } else {
          menu.classList.remove('sticky');
          console.log('Меню отфиксировано');
        }
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0
    }
  );
  
  observer.observe(trigger);
  console.log('Observer запущен');
}

document.addEventListener('DOMContentLoaded', initStickyMenu);





document.addEventListener('DOMContentLoaded', function() {
   
    function updateDropdownText(text) {
        const dropdownTrigger = document.getElementById('dropdownTrigger');
        if (dropdownTrigger) {
            const textElement = dropdownTrigger.querySelector('.wbapi-sabmenu-item-txt');
            if (textElement) {
                textElement.textContent = text;
            }
        }
    }


    const defiButton = document.getElementById('DefiItem');
    if (defiButton) {
        defiButton.addEventListener('click', function() {
            showContent('apiDefiIndex');
            activateMenuItems('apiDefiIndex');
            updateDropdownText('DeFi Index');
        });
    }
    

    const altcoinButton = document.getElementById('AltcoinItem');
    if (altcoinButton) {
        altcoinButton.addEventListener('click', function() {
            showContent('apiAltcoinIndex');
            activateMenuItems('apiAltcoinIndex');
            updateDropdownText('Altcoin Index');
        });
    }
    

    const menuItems = [...Object.keys(menuContentMap), ...Object.keys(menuContentMapMob)];
    menuItems.forEach(menuId => {
        const menuItem = document.getElementById(menuId);
        if (menuItem) {
            menuItem.addEventListener('click', function() {
                const textElement = this.querySelector('.wbapi-sabmenu-item-txt');
                if (textElement) {
                    updateDropdownText(textElement.textContent);
                }
            });
        }
    });
});