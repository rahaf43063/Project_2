// ==========================================================================
// Daily Drops Countdown Timer
// ==========================================================================
const timerDisplay = document.getElementById("timer");

if (timerDisplay) {
    let countdown = 170200;

    const timerInterval = setInterval(() => {
        if (countdown <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "00:00:00";
            return;
        }
        countdown--;

        const hours = String(Math.floor(countdown / 3600)).padStart(2, "0");
        const mins = String(Math.floor((countdown % 3600) / 60)).padStart(2, "0");
        const secs = String(countdown % 60).padStart(2, "0");

        timerDisplay.textContent = `${hours}:${mins}:${secs}`;
    }, 1000);
}


// ==========================================================================
// Product Filtering with Isotope
// ==========================================================================
// init Isotope
var $products = $('.all-products').isotope({
    originLeft: false,
});

// filter items on button click
$('.filter-button-group').on('click', 'button', function () {
    var filterValue = $(this).attr('data-filter');
    $products.isotope({ filter: filterValue });
});

const buttons = document.querySelectorAll('.filter-button-group .btn');
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
    btn.addEventListener('mouseenter', () => {
        btn.classList.add('hovering');
    });
    btn.addEventListener('mouseleave', () => {
        btn.classList.remove('hovering');
    });
});

// ==========================================================================
// Swiper Slider Configuration
// ==========================================================================
const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    loop: false,

    pagination: {
        el: '.swiper-pagination',
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    scrollbar: {
        el: '.swiper-scrollbar',
    },

    breakpoints: {
        640: {
            slidesPerView: 2,
            spaceBetween: 10,
        },
        768: {
            slidesPerView: 4,
            spaceBetween: 10,
        },
        1024: {
            slidesPerView: 6,
            spaceBetween: 10,
        },
    },
});


// ==========================================================================
// Image Modal Gallery
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const modalId = this.dataset.modal;
            document.getElementById(modalId).style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function () {
            const modal = this.closest('.image-modal');
            const mainImg = modal.querySelector('.main-image');
            const allThumbs = modal.querySelectorAll('.thumbnail');

            mainImg.src = this.dataset.large;

            allThumbs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function () {
            this.closest('.image-modal').style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });
});

// ==========================================================================
// Size Modal Functionality
// ==========================================================================
window.addEventListener('load', function () {
    const openBtn = document.getElementById('openSizeModal');
    const modal = document.getElementById('sizeModal');
    const closeBtn = document.querySelector('.close-modal');

    if (openBtn && modal) {
        openBtn.addEventListener('click', function (e) {
            e.preventDefault();
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }

    if (modal) {
        window.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});

// ==========================================================================
// Favorites Functionality
// ==========================================================================
function addToFavorites(buttonElement, event) {
    event.preventDefault();
    const heartIcon = buttonElement.querySelector('.fa-heart');

    heartIcon.classList.toggle('fa-regular');
    heartIcon.classList.toggle('fa-solid');
    buttonElement.classList.toggle('active');

    const notificationMessage = document.getElementById('favoriteMessage');
    if (notificationMessage) {
        notificationMessage.classList.add('show');
        setTimeout(() => {
            notificationMessage.classList.remove('show');
        }, 3000);
    } else {
        console.warn('Notification message element with ID "favoriteMessage" not found.');
    }
}

// ==========================================================================
// Cart Page Functionality
// ==========================================================================
function initializeCartItemListeners() {
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach(item => {
        const decreaseBtn = item.querySelector('.decrease-quantity');
        const increaseBtn = item.querySelector('.increase-quantity');
        const quantityInput = item.querySelector('.quantity-input');
        const removeItemBtn = item.querySelector('.remove-item');
        const itemPriceSpan = item.querySelector('.item-price');

        if (!quantityInput || !itemPriceSpan) {
            console.error('Missing quantity input or price span for a cart item.');
            return;
        }

        const originalPriceText = itemPriceSpan.dataset.originalUnitPrice || itemPriceSpan.textContent.replace(' ر.س', '').trim();
        const originalPrice = parseFloat(originalPriceText);

        function updateItemTotal() {
            const quantity = parseInt(quantityInput.value);
            const newTotal = (originalPrice * quantity).toFixed(2);
            itemPriceSpan.textContent = `${newTotal} ر.س`;
            updateCartSummary();
        }

        if (decreaseBtn) {
            decreaseBtn.onclick = () => {
                let quantity = parseInt(quantityInput.value);
                if (quantity > 1) {
                    quantity--;
                    quantityInput.value = quantity;
                    updateItemTotal();
                }
            };
        }

        if (increaseBtn) {
            increaseBtn.onclick = () => {
                let quantity = parseInt(quantityInput.value);
                quantity++;
                quantityInput.value = quantity;
                updateItemTotal();
            };
        }

        if (removeItemBtn) {
            removeItemBtn.onclick = () => {
                const isConfirmed = confirm('هل أنت متأكد من رغبتك في إزالة هذا المنتج من السلة؟');
                if (isConfirmed) {
                    item.remove();
                    updateCartSummary();
                    checkEmptyCart();
                }
            };
        }
    });
}

function applyCouponCode() {
    const couponInput = document.getElementById('couponCode');
    const couponCode = couponInput?.value.trim().toUpperCase();

    const validCoupons = {
        'SAVE10': 10.00,
        'FREESHIP': 15.00,
        'RAHAF50': 50.00
    };

    let discount = 0.00;
    if (couponCode && validCoupons[couponCode]) {
        discount = validCoupons[couponCode];
        alert(`تم تطبيق الكوبون بنجاح! خصم ${discount.toFixed(2)} ر.س`);
    } else if (couponCode) {
        alert('رمز الكوبون غير صالح، يرجى المحاولة مرة أخرى.');
    }
    updateCartSummary(discount);
}

function updateCartSummary(discount = 0.00) {
    let subtotal = 0;
    const currentCartItems = document.querySelectorAll('.cart-item');

    currentCartItems.forEach(item => {
        const priceText = item.querySelector('.item-price').textContent.replace(' ر.س', '').trim();
        subtotal += parseFloat(priceText);
    });

    // Determine the shipping cost
    let shipping = (currentCartItems.length === 0) ? 0.00 : 15.00; // Shipping is free if the cart is empty

    // Calculate total
    const total = subtotal + shipping - discount;

    // Get the summary elements
    const summaryShippingElement = document.getElementById('summaryShipping');
    const summaryDiscountElement = document.getElementById('summaryDiscount');
    const summaryTotalElement = document.getElementById('summaryTotal');

    // Update the text content of the elements
    if (summaryShippingElement) summaryShippingElement.textContent = `${shipping.toFixed(2)} ر.س`;
    if (summaryDiscountElement) summaryDiscountElement.textContent = `-${discount.toFixed(2)} ر.س`;
    if (summaryTotalElement) summaryTotalElement.textContent = `${total.toFixed(2)} ر.س`;
}

function checkEmptyCart() {
    const currentCartItems = document.querySelectorAll('.cart-item');
    const cartItemsContainer = document.querySelector('.cart-section');
    const couponSectionElement = document.querySelector('.coupon-section');
    const cartSummarySection = document.querySelector('.cart-summary');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const cartHeader = document.querySelector('.d-none.d-md-flex');

    if (currentCartItems.length === 0) {
        if (emptyCartMessage) {
            emptyCartMessage.classList.remove('d-none');
        }
        if (cartItemsContainer) {
            cartItemsContainer.style.display = 'none';
        }
        if (couponSectionElement) {
            couponSectionElement.style.display = 'none';
        }
        if (cartSummarySection) {
            cartSummarySection.style.display = 'none';
        }
        if (cartHeader) {
            cartHeader.style.display = 'none';
        }
    }
    else {
        if (emptyCartMessage) {
            emptyCartMessage.classList.add('d-none');
        }
        if (cartItemsContainer) {
            cartItemsContainer.style.display = 'block';
        }
        if (couponSectionElement) {
            couponSectionElement.style.display = 'block';
        }
        if (cartSummarySection) {
            cartSummarySection.style.display = 'block';
        }
        if (cartHeader) {
            cartHeader.style.display = 'flex';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeCartItemListeners();
    updateCartSummary();
    checkEmptyCart();

    const applyCouponBtn = document.getElementById('applyCouponBtn');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCouponCode);
    }
});

function checkEmptyCart() {
    const currentCartItems = document.querySelectorAll('.cart-item');
    const cartItemsContainer = document.querySelector('.cart-section');
    const couponSectionElement = document.querySelector('.coupon-section');
    const cartSummarySection = document.querySelector('.cart-summary');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const cartHeader = document.querySelector('.d-none.d-md-flex');

    if (currentCartItems.length === 0) {
        if (emptyCartMessage) emptyCartMessage.classList.remove('d-none');
        if (cartItemsContainer) cartItemsContainer.style.display = 'none';
        if (couponSectionElement) couponSectionElement.style.display = 'none';
        if (cartSummarySection) cartSummarySection.style.display = 'none';
        if (cartHeader) cartHeader.style.display = 'none';
    } else {
        if (emptyCartMessage) emptyCartMessage.classList.add('d-none');
        if (cartItemsContainer) cartItemsContainer.style.display = 'block';
        if (couponSectionElement) couponSectionElement.style.display = 'block';
        if (cartSummarySection) cartSummarySection.style.display = 'block';
        if (cartHeader) cartHeader.style.display = 'flex';
    }
}

// ==========================================================================
// Dark Mode
// ==========================================================================
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', newTheme);
    const icon = document.getElementById('modeIcon');
    if (icon) {
        icon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    localStorage.setItem('theme', newTheme);
}

document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const icon = document.getElementById('modeIcon');
    if (icon) {
        icon.className = savedTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
});