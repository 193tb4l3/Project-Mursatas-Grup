document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const projectCards = document.querySelectorAll('.project-card');
    
    function filterProjects() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        projectCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const categories = card.dataset.categories.toLowerCase();
            
            if (searchTerm === '' || 
                title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                categories.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Event listeners
    searchBtn.addEventListener('click', filterProjects);
    searchInput.addEventListener('input', filterProjects);
    
    // Animation on scroll
    const animateOnScroll = function() {
        const cards = document.querySelectorAll('.project-card');
        const windowHeight = window.innerHeight;
        
        cards.forEach((card, index) => {
            const cardPosition = card.getBoundingClientRect().top;
            const animationPoint = windowHeight - 100;
            
            if (cardPosition < animationPoint) {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    };
    
    // Initialize cards for animation
    const projectCardsAll = document.querySelectorAll('.project-card');
    projectCardsAll.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run on load and scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Theme toggle functionality
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    document.body.appendChild(themeToggle);

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', isDarkMode);
    });

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Create category filter buttons
    const categories = new Set();
    document.querySelectorAll('.project-card').forEach(card => {
        const cardCategories = card.dataset.categories.split(' ');
        cardCategories.forEach(cat => categories.add(cat));
    });

    const categoryFilterContainer = document.createElement('div');
    categoryFilterContainer.className = 'category-filter';
    
    // Add "All" button
    const allButton = document.createElement('button');
    allButton.className = 'category-btn active';
    allButton.textContent = 'All';
    allButton.dataset.category = 'all';
    categoryFilterContainer.appendChild(allButton);

    // Add category buttons
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        button.dataset.category = category;
        categoryFilterContainer.appendChild(button);
    });

    // Insert category filter after search section
    document.querySelector('.search-section').insertAdjacentElement('afterend', categoryFilterContainer);

    // Filter projects by category
    categoryFilterContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-btn')) {
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            const selectedCategory = e.target.dataset.category;
            filterProjects(selectedCategory);
        }
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const projectCards = document.querySelectorAll('.project-card');
    
    function filterProjects(selectedCategory = 'all') {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        projectCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const categories = card.dataset.categories.toLowerCase();
            
            const matchesSearch = searchTerm === '' || 
                title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                categories.includes(searchTerm);
            
            const matchesCategory = selectedCategory === 'all' || 
                card.dataset.categories.split(' ').includes(selectedCategory);
            
            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Event listeners
    searchBtn.addEventListener('click', () => filterProjects(
        document.querySelector('.category-btn.active').dataset.category
    ));
    searchInput.addEventListener('input', () => filterProjects(
        document.querySelector('.category-btn.active').dataset.category
    ));
    
    // Add rating system to each project card
    document.querySelectorAll('.project-card').forEach(card => {
        const ratingContainer = document.createElement('div');
        ratingContainer.className = 'rating';
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = 'far fa-star';
            star.dataset.rating = i;
            ratingContainer.appendChild(star);
        }
        
        card.querySelector('.card-content').insertBefore(ratingContainer, card.querySelector('.visit-btn'));
        
        // Rating functionality
        ratingContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'I') {
                const rating = parseInt(e.target.dataset.rating);
                const stars = ratingContainer.querySelectorAll('i');
                
                stars.forEach((star, index) => {
                    if (index < rating) {
                        star.classList.add('active');
                        star.classList.remove('far');
                        star.classList.add('fas');
                    } else {
                        star.classList.remove('active');
                        star.classList.remove('fas');
                        star.classList.add('far');
                    }
                });
                
                // In a real app, you would save this to a database
                console.log(`Rating ${rating} given to project: ${card.querySelector('h3').textContent}`);
            }
        });
    });
    
    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Animation on scroll
    const animateOnScroll = function() {
        const cards = document.querySelectorAll('.project-card');
        const windowHeight = window.innerHeight;
        
        cards.forEach((card, index) => {
            const cardPosition = card.getBoundingClientRect().top;
            const animationPoint = windowHeight - 100;
            
            if (cardPosition < animationPoint) {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    };
    
    // Initialize cards for animation
    const projectCardsAll = document.querySelectorAll('.project-card');
    projectCardsAll.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run on load and scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});