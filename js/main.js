document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#' || href === '#top') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                try {
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                } catch (err) {
                    // console.error("Smooth scroll error for selector:", href, err);
                }
            }
        });
    });

    // Hamburger Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-navigation'); // This is mainNavForPopup

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = mainNav.classList.toggle('is-active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            if (isExpanded) {
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    // AJAX Contact Form Submission for Contact Page
    const contactFormPage = document.getElementById('contact-form-page');
    const formMessagesPage = document.getElementById('form-messages');

    if (contactFormPage && formMessagesPage) {
        contactFormPage.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(contactFormPage);
            const formAction = contactFormPage.getAttribute('action');
            formMessagesPage.innerHTML = '<p>در حال ارسال پیام شما...</p>';
            formMessagesPage.className = '';

            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) return response.json();
                return response.json().then(data => {
                    if (data.errors) throw new Error(data.errors.map(error => error.message).join(', '));
                    if (data.error) throw new Error(data.error);
                    throw new Error('خطایی در ارسال فرم رخ داد.');
                });
            })
            .then(data => {
                formMessagesPage.innerHTML = '<p>پیام شما با موفقیت ارسال شد. سپاسگزارم!</p>';
                formMessagesPage.classList.add('success-message');
                contactFormPage.reset();
            })
            .catch(error => {
                formMessagesPage.innerHTML = `<p>خطا: ${error.message || 'لطفاً اتصال اینترنت خود را بررسی کرده و مجدداً تلاش نمایید.'}</p>`;
                formMessagesPage.classList.add('error-message');
            });
        });
    }

    // AJAX Contact Form Submission for Homepage Form
    const contactFormHome = document.getElementById('contact-form-home');
    const formMessagesHome = document.getElementById('form-messages-home');

    if (contactFormHome && formMessagesHome) {
        contactFormHome.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(contactFormHome);
            const formAction = contactFormHome.getAttribute('action');
            formMessagesHome.innerHTML = '<p>در حال ارسال پیام شما...</p>';
            formMessagesHome.className = '';

            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) return response.json();
                return response.json().then(data => {
                    if (data.errors) throw new Error(data.errors.map(error => error.message).join(', '));
                    if (data.error) throw new Error(data.error);
                    throw new Error('خطایی در ارسال فرم رخ داد.');
                });
            })
            .then(data => {
                formMessagesHome.innerHTML = '<p>پیام شما با موفقیت ارسال شد. سپاسگزارم!</p>';
                formMessagesHome.classList.add('success-message');
                contactFormHome.reset();
            })
            .catch(error => {
                formMessagesHome.innerHTML = `<p>خطا: ${error.message || 'لطفاً اتصال اینترنت خود را بررسی کرده و مجدداً تلاش نمایید.'}</p>`;
                formMessagesHome.classList.add('error-message');
            });
        });
    }

    // Custom VERTICAL Scrollbar for Single Project Page Screenshot Viewer
    const screenshotFrame = document.querySelector('.single-project-page .screenshot-frame');
    const scrollableImage = document.getElementById('scrollable-image');
    const scrollbarTrack = document.getElementById('scrollbar-track');
    const scrollbarHandle = document.getElementById('scrollbar-handle');

    if (screenshotFrame && scrollableImage && scrollbarTrack && scrollbarHandle) {
        let isDragging = false;
        let startY_coord; 
        let startScrollTop;

        function updateScrollbar() {
            if (!screenshotFrame || !scrollbarTrack || !scrollbarHandle) return;
            
            const trackDisplay = window.getComputedStyle(scrollbarTrack).display;
            if (trackDisplay === 'none') {
                scrollbarHandle.style.height = '0px';
                return;
            }

            const scrollableHeight = screenshotFrame.scrollHeight;
            const visibleHeight = screenshotFrame.clientHeight;

            if (scrollableHeight <= visibleHeight) {
                scrollbarTrack.style.display = 'none';
                return;
            }
            scrollbarTrack.style.display = 'flex'; 

            const handleHeightRatio = visibleHeight / scrollableHeight;
            const minHandleHeight = 20;
            let handleHeight = handleHeightRatio * scrollbarTrack.clientHeight;
            handleHeight = Math.max(handleHeight, minHandleHeight);
            scrollbarHandle.style.height = `${handleHeight}px`;

            const scrollTop = screenshotFrame.scrollTop;
            const scrollPercentage = (scrollableHeight - visibleHeight > 0) ? scrollTop / (scrollableHeight - visibleHeight) : 0;
            const trackScrollableHeight = scrollbarTrack.clientHeight - handleHeight;
            
            if (trackScrollableHeight >= 0) {
                scrollbarHandle.style.top = `${scrollPercentage * trackScrollableHeight}px`;
            } else {
                scrollbarHandle.style.top = '0px';
            }
        }

        screenshotFrame.addEventListener('scroll', updateScrollbar);
        screenshotFrame.addEventListener('touchmove', function() {
            requestAnimationFrame(updateScrollbar);
        }, { passive: true });


        function handleDragStart(e) {
            if (window.getComputedStyle(scrollbarTrack).display === 'none') return;
            isDragging = true;
            startScrollTop = screenshotFrame.scrollTop;
            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
            scrollbarHandle.style.cursor = 'grabbing';

            if (e.type === 'touchstart') {
                if (e.touches.length === 1) {
                    startY_coord = e.touches[0].clientY;
                } else {
                    isDragging = false; return;
                }
            } else { 
                startY_coord = e.clientY;
            }
        }

        function handleDragMove(e) {
            if (!isDragging) return;
            if (e.type === 'touchmove') {
                e.preventDefault();
            }

            const currentY = (e.type === 'touchmove') ? e.touches[0].clientY : e.clientY;
            const dy = currentY - startY_coord;

            const scrollableHeight = screenshotFrame.scrollHeight;
            const visibleHeight = screenshotFrame.clientHeight;
            if (scrollableHeight <= visibleHeight) return;

            const trackHeight = scrollbarTrack.clientHeight;
            const handleHeight = scrollbarHandle.offsetHeight;
            const scrollableTrackArea = trackHeight - handleHeight;

            if (scrollableTrackArea < 0) return; 

            const scrollDeltaRatio = scrollableTrackArea === 0 ? 0 : dy / scrollableTrackArea; 
            screenshotFrame.scrollTop = startScrollTop + scrollDeltaRatio * (scrollableHeight - visibleHeight);
        }

        function handleDragEnd() {
            if (isDragging) {
                isDragging = false;
                scrollbarHandle.style.cursor = 'grab';
                document.body.style.userSelect = '';
                document.body.style.webkitUserSelect = '';
            }
        }

        scrollbarHandle.addEventListener('mousedown', handleDragStart);
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);

        scrollbarHandle.addEventListener('touchstart', handleDragStart, { passive: false });
        document.addEventListener('touchmove', handleDragMove, { passive: false });
        document.addEventListener('touchend', handleDragEnd);
        document.addEventListener('touchcancel', handleDragEnd);
        
        scrollbarTrack.addEventListener('click', function(e) {
            if (window.getComputedStyle(scrollbarTrack).display === 'none') return;
            if (e.target === scrollbarTrack) {
                const scrollableHeight = screenshotFrame.scrollHeight;
                const visibleHeight = screenshotFrame.clientHeight;
                if (scrollableHeight <= visibleHeight) return;

                const trackRect = scrollbarTrack.getBoundingClientRect();
                const clickYInTrack = e.clientY - trackRect.top;
                const handleHeight = scrollbarHandle.offsetHeight;
                const trackScrollableHeight = trackRect.height - handleHeight;

                if (trackScrollableHeight < 0) return;
                
                let relativeClickY = clickYInTrack - (handleHeight / 2);
                relativeClickY = Math.max(0, Math.min(relativeClickY, trackScrollableHeight));
                
                const scrollPercentage = trackScrollableHeight === 0 ? 0 : relativeClickY / trackScrollableHeight;
                screenshotFrame.scrollTop = scrollPercentage * (scrollableHeight - visibleHeight);
            }
        });

        updateScrollbar();
        window.addEventListener('resize', updateScrollbar);
        const imagesInsideFrame = screenshotFrame.querySelectorAll('img');
        imagesInsideFrame.forEach(img => {
            img.addEventListener('load', updateScrollbar);
        });
    }

    // Blog Pagination
    function setupBlogPagination() {
        const postsContainer = document.querySelector('.blog-page .blog-posts-list');
        const paginationNavElement = document.querySelector('.blog-page .pagination');
        const paginationUl = paginationNavElement ? paginationNavElement.querySelector('ul') : null;

        if (!postsContainer || !paginationUl || !paginationNavElement) {
            if (paginationNavElement) paginationNavElement.style.display = 'none';
            return;
        }

        const allPostItems = Array.from(postsContainer.querySelectorAll('article.blog-post-item'));

        if (allPostItems.length === 0) {
            paginationNavElement.style.display = 'none';
            return;
        }

        const datedPosts = allPostItems.map(postElement => {
            const timeElement = postElement.querySelector('time[datetime]');
            const date = timeElement ? new Date(timeElement.getAttribute('datetime')) : new Date(0);
            return { element: postElement, date: date };
        });

        datedPosts.sort((a, b) => b.date - a.date);
        const sortedPostElements = datedPosts.map(p => p.element);

        let currentPage = 1;
        const postsPerPage = 10;
        const totalPosts = sortedPostElements.length;
        const totalPages = Math.ceil(totalPosts / postsPerPage);

        function displayPosts(page, shouldScroll = false) { 
            currentPage = page;
            allPostItems.forEach(item => item.style.display = 'none');

            const startIndex = (page - 1) * postsPerPage;
            const endIndex = startIndex + postsPerPage;
            const postsToShow = sortedPostElements.slice(startIndex, endIndex);

            postsToShow.forEach(item => {
                item.style.display = 'flex';
            });

            updatePaginationControls();

            if (shouldScroll && postsContainer && typeof postsContainer.getBoundingClientRect === 'function') {
                const headerOffset = 100; 
                const elementPosition = postsContainer.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;
            
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }

        function updatePaginationControls() {
            paginationUl.innerHTML = ''; 

            if (totalPages <= 1) {
                paginationNavElement.style.display = 'none';
                return;
            }
            paginationNavElement.style.display = 'flex';

            let paginationHTML = '';
            let prevDisabledClass = (currentPage === 1) ? ' disabled' : '';
            paginationHTML += `<li><a href="#" class="page-number prev${prevDisabledClass}" data-action="prev"><i class="fas fa-angle-double-right"></i> قبلی</a></li>`;

            for (let i = 1; i <= totalPages; i++) {
                let activeClass = (i === currentPage) ? ' active' : '';
                paginationHTML += `<li><a href="#" class="page-number${activeClass}" data-page="${i}">${i}</a></li>`;
            }

            let nextDisabledClass = (currentPage === totalPages) ? ' disabled' : '';
            paginationHTML += `<li><a href="#" class="page-number next${nextDisabledClass}" data-action="next">بعدی <i class="fas fa-angle-double-left"></i></a></li>`;

            paginationUl.innerHTML = paginationHTML;

            paginationUl.querySelectorAll('a.page-number').forEach(link => {
                if (link.classList.contains('disabled')) return;

                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const action = link.dataset.action;
                    const pageNum = parseInt(link.dataset.page);
                    
                    if (action === 'prev') {
                        if (currentPage > 1) displayPosts(currentPage - 1, true); 
                    } else if (action === 'next') {
                        if (currentPage < totalPages) displayPosts(currentPage + 1, true); 
                    } else if (pageNum) {
                        if (pageNum !== currentPage) {
                             displayPosts(pageNum, true); 
                        } else {
                             displayPosts(pageNum, false); // Clicking current page, don't scroll
                        }
                    }
                });
            });
        }

        if (totalPosts > 0) {
            displayPosts(1, false); 
        } else {
            paginationNavElement.style.display = 'none';
        }
    }

    if (document.body.classList.contains('blog-page') && !document.body.classList.contains('single-post-page')) {
        setupBlogPagination();
    }

    // Pop-up Modal Logic
    const openPopupButtonDesktop = document.getElementById('open-popup-btn'); 
    const openPopupButtonMobile = document.getElementById('open-popup-btn-mobile'); 
    const closePopupButton = document.getElementById('close-popup-btn');
    const popupOverlay = document.getElementById('order-popup-overlay');
    const popupDialog = document.getElementById('order-popup-dialog');
    // mainNav is already defined above for hamburger menu, can be reused if needed or select again
    const menuToggleForPopupClose = document.querySelector('.menu-toggle'); // Renamed to avoid conflict

    function openPopup() {
        if (popupOverlay && popupDialog) {
            popupOverlay.style.display = 'flex';
            setTimeout(() => {
                popupOverlay.classList.add('is-active');
                document.body.classList.add('popup-open');
            }, 10);
            popupDialog.setAttribute('aria-hidden', 'false');
        }
    }

    function closePopup() {
        if (popupOverlay && popupDialog) {
            popupOverlay.classList.remove('is-active');
            document.body.classList.remove('popup-open');
            popupDialog.setAttribute('aria-hidden', 'true');
            setTimeout(() => {
                if (!popupOverlay.classList.contains('is-active')) {
                    popupOverlay.style.display = 'none';
                }
            }, 300); 
        }
    }

    if (closePopupButton) { 
        closePopupButton.addEventListener('click', closePopup);
    }
    if (popupOverlay) {
        popupOverlay.addEventListener('click', function(event) {
            if (event.target === popupOverlay) {
                closePopup();
            }
        });
    }
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && popupOverlay && popupOverlay.classList.contains('is-active')) {
            closePopup();
        }
    });

    if (openPopupButtonDesktop && popupOverlay) {
        openPopupButtonDesktop.addEventListener('click', openPopup);
    }

    if (openPopupButtonMobile && popupOverlay && mainNav && menuToggleForPopupClose) { // mainNav is from hamburger section
        openPopupButtonMobile.addEventListener('click', function(e) {
            e.preventDefault(); 
            openPopup();
            if (mainNav.classList.contains('is-active')) {
                mainNav.classList.remove('is-active');
                menuToggleForPopupClose.setAttribute('aria-expanded', 'false');
                menuToggleForPopupClose.innerHTML = '<i class="fas fa-bars"></i>'; 
            }
        });
    }

    const popupContactForm = document.getElementById('popup-contact-form');
    const popupFormMessages = document.getElementById('popup-form-messages');

    if (popupContactForm && popupFormMessages) {
        popupContactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(popupContactForm);
            const formAction = popupContactForm.getAttribute('action');

            popupFormMessages.innerHTML = '<p>در حال ارسال درخواست شما...</p>';
            popupFormMessages.className = ''; 

            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) return response.json();
                return response.json().then(data => {
                    if (data.errors) throw new Error(data.errors.map(error => error.message).join(', '));
                    if (data.error) throw new Error(data.error);
                    throw new Error('خطایی در ارسال درخواست رخ داد.');
                });
            })
            .then(data => {
                popupFormMessages.innerHTML = '<p>درخواست شما با موفقیت ارسال شد. به زودی با شما تماس خواهم گرفت.</p>';
                popupFormMessages.classList.add('success-message');
                popupContactForm.reset();
            })
            .catch(error => {
                popupFormMessages.innerHTML = `<p>خطا: ${error.message || 'لطفاً اتصال اینترنت خود را بررسی کرده و مجدداً تلاش نمایید.'}</p>`;
                popupFormMessages.classList.add('error-message');
            });
        });
    }

    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') { 
        AOS.init({
            duration: 400, 
            once: true,    
            offset: 100,   
            easing: 'ease-in-out', 
        });
    }

    // Theme Toggle Functionality
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const bodyElement = document.body;

    if (themeToggleBtn && bodyElement) {
        const themeIcon = themeToggleBtn.querySelector('i');

        themeToggleBtn.addEventListener('click', () => {
            bodyElement.classList.toggle('dark-mode');

            if (bodyElement.classList.contains('dark-mode')) {
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
                themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
                localStorage.setItem('theme', 'dark');
            } else {
                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
                themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
                localStorage.setItem('theme', 'light');
            }
        });

        // Check for saved theme preference on load
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            bodyElement.classList.add('dark-mode');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
        } else {
             bodyElement.classList.remove('dark-mode'); // Ensure it's light if no preference or light
             if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
             }
             themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
    
    console.log("وب سایت پورتفولیو با فونت IRANYekanX و پایه واکنش‌گرا آماده است!");
});