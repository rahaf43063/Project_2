// ==========================================================================
// Checkout Page Functionality
// ==========================================================================
let currentStep = 1;
const totalSteps = 3;
const finalConfirmationStep = 4;
const currencySymbol = ' ر.س';

let checkoutCartItems = [
    { id: 2, name: 'فستان سهرة أنيق', price: 205.58, quantity: 1, image: 'images/products/product_46.png' },
    { id: 3, name: 'فستان زفاف', price: 871.00, quantity: 1, image: 'images/products/product_47.png' },
    { id: 4, name: 'خمار أرنب أنيق', price: 24.00, quantity: 1, image: 'images/products/product_57.png' },
];

const checkoutShippingCost = 15.00;
let checkoutDiscountAmount = 0.00;

window.showStep = function (stepNumber) {
    document.querySelectorAll('.step-content').forEach(stepContent => {
        stepContent.classList.add('d-none');
    });

    const targetStepElement = document.getElementById(`step${stepNumber}`);
    if (targetStepElement) {
        targetStepElement.classList.remove('d-none');
    }

    document.querySelectorAll('.checkout-steps .step').forEach(step => {
        const dataStep = parseInt(step.getAttribute('data-step'));
        step.classList.remove('active', 'current', 'completed');

        if (dataStep < stepNumber) {
            step.classList.add('active', 'completed');
        } else if (dataStep === stepNumber) {
            step.classList.add('active', 'current');
        }
    });

    const fillPercentage = ((stepNumber - 1) / (totalSteps - 1)) * 100;
    const stepLineFill = document.querySelector('.step-line-fill');
    if (stepLineFill) {
        stepLineFill.style.width = `${fillPercentage}%`;
    }

    currentStep = stepNumber;

    if (stepNumber === 2) {
        const checkedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
        if (checkedPaymentMethod) {
            checkedPaymentMethod.dispatchEvent(new Event('change'));
        }
    }
};

window.validateCurrentStep = function () {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (!currentStepElement) return false;

    const requiredInputs = currentStepElement.querySelectorAll('[required]');
    let isValid = true;

    requiredInputs.forEach(input => {
        input.classList.remove('is-invalid');

        const parentPaymentDetails = input.closest('.payment-details');
        if (parentPaymentDetails && parentPaymentDetails.classList.contains('d-none')) {
            return;
        }

        if (input.id === 'phone') {
            if (window.phoneInput && !window.phoneInput.isValidNumber()) {
                input.classList.add('is-invalid');
                isValid = false;
            }
            return;
        }
        if (!input.checkValidity()) {
            input.classList.add('is-invalid');
            isValid = false;
        }
    });

    return isValid;
};

window.nextStep = function (e) {
    if (e) e.preventDefault();

    if (!validateCurrentStep()) {
        // Find and focus the first invalid input
        const firstInvalid = document.querySelector('.is-invalid');
        if (firstInvalid) {
            firstInvalid.focus();
        } else {
            showCustomAlert('خطأ في الإدخال', 'الرجاء ملء جميع الحقول المطلوبة بشكل صحيح.');
        }
        return false;
    }

    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);

        if (currentStep === totalSteps) {
            populateOrderSummary();
        }
    }
    return false;
};

window.prevStep = function () {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
};

window.placeOrder = function () {
    if (!validateCurrentStep()) {
        showCustomAlert('خطأ في الإدخال', 'الرجاء مراجعة معلومات الطلب قبل التأكيد.');
        return;
    }

    showStep(finalConfirmationStep);
    checkoutCartItems = [];
};

function renderCheckoutCartItems() {
    const reviewItemsList = document.getElementById('reviewItemsList');
    if (!reviewItemsList) return;

    reviewItemsList.innerHTML = '';

    if (checkoutCartItems.length === 0) {
        reviewItemsList.innerHTML = `<p class="text-muted">لا توجد منتجات في سلة المراجعة.</p>`;
        return;
    }

    checkoutCartItems.forEach((item) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('d-flex', 'align-items-center', 'mb-2', 'review-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px; margin-left: 10px;">
            <div class="flex-grow-1">
                <p class="mb-0 fw-bold">${item.name}</p>
                <small class="text-muted">${item.quantity} x ${item.price.toFixed(2)}${currencySymbol}</small>
            </div>
            <span class="fw-bold">${(item.price * item.quantity).toFixed(2)}${currencySymbol}</span>
        `;
        reviewItemsList.appendChild(itemElement);
    });

    updateCheckoutSummary();
}

function updateCheckoutSummary() {
    let subtotal = checkoutCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let total = subtotal + checkoutShippingCost - checkoutDiscountAmount;

    const reviewSubtotal = document.getElementById('reviewSubtotal');
    const reviewShipping = document.getElementById('reviewShipping');
    const reviewDiscount = document.getElementById('reviewDiscount');
    const reviewTotal = document.getElementById('reviewTotal');

    if (reviewSubtotal) reviewSubtotal.innerText = subtotal.toFixed(2) + currencySymbol;
    if (reviewShipping) reviewShipping.innerText = checkoutShippingCost.toFixed(2) + currencySymbol;
    if (reviewDiscount) reviewDiscount.innerText = '-' + checkoutDiscountAmount.toFixed(2) + currencySymbol;
    if (reviewTotal) reviewTotal.innerText = total.toFixed(2) + currencySymbol;
}

function populateOrderSummary() {
    document.getElementById('reviewFullName').innerText = document.getElementById('fullName').value;
    document.getElementById('reviewAddress').innerText = document.getElementById('address').value;
    document.getElementById('reviewCountry').innerText = document.getElementById('country').options[document.getElementById('country').selectedIndex].text;
    document.getElementById('reviewZipCode').innerText = document.getElementById('zipCode').value;
    document.getElementById('reviewPhone').innerText = window.phoneInput ? window.phoneInput.getNumber() : document.getElementById('phone').value;
    document.getElementById('reviewEmail').innerText = document.getElementById('email').value;
    document.getElementById('reviewShippingNotes').innerText = document.getElementById('shippingNotes').value || 'لا توجد ملاحظات';

    const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    let paymentMethodText = '';
    if (selectedPaymentMethod === 'credit-card') {
        paymentMethodText = 'بطاقة الائتمان / الخصم';
    } else if (selectedPaymentMethod === 'cash-on-delivery') {
        paymentMethodText = 'الدفع عند الاستلام';
    }
    document.getElementById('reviewPaymentMethod').innerText = paymentMethodText;

    renderCheckoutCartItems();
    updateCheckoutSummary();
}

// ==========================================================================
// Initialize All Functionality
// ==========================================================================
document.addEventListener("DOMContentLoaded", function () {
    const isCartPage = document.querySelector('.cart-section') !== null;
    const isCheckoutPage = document.querySelector('.checkout-container') !== null;

    if (isCartPage) {
        initializeCartItemListeners();
        updateCartSummary();
        checkEmptyCart();

        const applyCouponBtn = document.getElementById('applyCouponBtn');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', () => {
                const couponCode = document.getElementById('couponCode').value.trim();
                if (couponCode) {
                    showCustomAlert('تطبيق الكوبون', `تم محاولة تطبيق الكوبون: ${couponCode}. في تطبيق حقيقي، سيتم التحقق من هذا الكوبون.`);
                } else {
                    showCustomAlert('خطأ', 'الرجاء إدخال رمز الكوبون.');
                }
            });
        }
    }

    if (isCheckoutPage) {
        const phoneInput = document.querySelector("#phone");
        if (phoneInput && !window.phoneInput) {  // Only initialize if not already initialized
            window.phoneInput = window.intlTelInput(phoneInput, {
                initialCountry: "sa",
                separateDialCode: true,
                preferredCountries: ["sa", "ae", "qa", "bh", "om", "kw", "eg", "jo"],
                utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
            });

            // Add validation on blur
            phoneInput.addEventListener('blur', function () {
                if (window.phoneInput && !window.phoneInput.isValidNumber()) {
                    this.classList.add('is-invalid');
                } else {
                    this.classList.remove('is-invalid');
                }
            });

            // Remove invalid state on input
            phoneInput.addEventListener('input', function () {
                this.classList.remove('is-invalid');
            });
        }

        document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
            radio.addEventListener('change', function () {
                const creditCardDetailsDiv = document.getElementById('creditCardDetails');
                const cashOnDeliveryDetailsDiv = document.getElementById('cashOnDeliveryDetails');

                creditCardDetailsDiv?.classList.add('d-none');
                cashOnDeliveryDetailsDiv?.classList.add('d-none');

                creditCardDetailsDiv?.querySelectorAll('[data-required-if-visible="true"]').forEach(input => {
                    input.removeAttribute('required');
                    input.classList.remove('is-invalid');
                });

                if (this.value === 'credit-card') {
                    creditCardDetailsDiv?.classList.remove('d-none');
                    creditCardDetailsDiv?.querySelectorAll('[data-required-if-visible="true"]').forEach(input => {
                        input.setAttribute('required', 'required');
                    });
                } else if (this.value === 'cash-on-delivery') {
                    cashOnDeliveryDetailsDiv?.classList.remove('d-none');
                }

                document.querySelectorAll('.payment-method-card').forEach(card => {
                    card.classList.remove('selected');
                });
                this.closest('.payment-method-card')?.classList.add('selected');
            });
        });

        showStep(1);
    }
});

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
