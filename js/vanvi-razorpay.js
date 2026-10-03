/**
 * VANVI MOMENTS — RAZORPAY STANDARD WEB CHECKOUT CLIENT
 * Implements Razorpay Standard Checkout SDK flow:
 * 1. Calls POST /api/create-order
 * 2. Launches Razorpay modal (checkout.js)
 * 3. Handles success, dismissal, and failure
 * 4. Calls POST /api/verify-payment with HMAC-SHA256 signature
 */

(function(window) {
  'use strict';

  const VanviRazorpay = {
    /**
     * Get API base URL (supports local dev & production)
     */
    getApiBase() {
      if (window.location.origin && !window.location.origin.startsWith('file:')) {
        return window.location.origin;
      }
      return 'http://localhost:3000';
    },

    /**
     * Ensure Razorpay checkout.js script is loaded in DOM
     */
    async ensureScriptLoaded() {
      if (typeof window.Razorpay === 'function') {
        return true;
      }

      return new Promise((resolve, reject) => {
        const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
        if (existing) {
          existing.addEventListener('load', () => resolve(true));
          existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay checkout script.')));
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Failed to load Razorpay checkout.js from CDN.'));
        document.head.appendChild(script);
      });
    },

    /**
     * STEP 1: Create Order on Backend
     * Calls POST /api/create-order with amount in paise
     */
    async createOrder({ amountPaise, currency = 'INR', receipt, notes = {} }) {
      const numeric = Number(amountPaise);
      if (!numeric || isNaN(numeric) || numeric < 100) {
        throw new Error('Minimum order amount is 100 paise (₹1.00)');
      }

      const res = await fetch(`${this.getApiBase()}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(numeric),
          currency,
          receipt: receipt || `rcpt_${Date.now()}`,
          notes
        })
      });

      const data = await res.json();
      if (!res.ok || !data.order_id) {
        throw new Error(data.error || 'Failed to create Razorpay order');
      }

      return data; // { order_id, amount, currency, key_id }
    },

    /**
     * STEP 3: Verify Payment Signature on Backend
     * Calls POST /api/verify-payment with order_id, payment_id, razorpay_signature
     */
    async verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature, extraData = {} }) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new Error('Missing payment verification parameters');
      }

      const res = await fetch(`${this.getApiBase()}/api/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          ...extraData
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Payment verification failed: Signature mismatch.');
      }

      return data;
    },

    /**
     * STEP 2: Standard Modal Checkout Flow
     * Combines Step 1, modal opening, dismiss handling, failure handling, and Step 3 verification.
     */
    async openCheckout(options = {}) {
      const {
        amountPaise,
        currency = 'INR',
        name = 'Vanvi Moments',
        description = 'Luxury Digital Celebration',
        receipt,
        notes = {},
        prefill = {},
        themeColor = '#ff2a7a',
        onSuccess,
        onDismiss,
        onFailure
      } = options;

      // 1. Ensure SDK loaded
      await this.ensureScriptLoaded();

      // 2. Create Order on Backend
      const orderData = await this.createOrder({
        amountPaise,
        currency,
        receipt,
        notes
      });

      // 3. Configure Razorpay Standard Modal
      const modalOptions = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: name,
        description: description,
        image: 'assets/favicon.svg',
        order_id: orderData.order_id,
        prefill: {
          name: prefill.name || '',
          email: prefill.email || '',
          contact: prefill.contact || ''
        },
        theme: {
          color: themeColor
        },
        handler: async (response) => {
          try {
            // STEP 3: Verify Signature
            const verifyResult = await this.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              extraData: notes
            });

            if (typeof onSuccess === 'function') {
              onSuccess({
                ...verifyResult,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                orderData
              });
            }
          } catch (err) {
            console.error('Payment verification failed:', err);
            if (typeof onFailure === 'function') {
              onFailure(err);
            } else {
              alert('Payment Verification Failed: ' + err.message);
            }
          }
        },
        modal: {
          ondismiss: () => {
            console.log('Razorpay modal dismissed by user.');
            if (typeof onDismiss === 'function') {
              onDismiss();
            }
          }
        }
      };

      const rzp = new window.Razorpay(modalOptions);

      // Handle payment failure event
      rzp.on('payment.failed', (response) => {
        console.error('Razorpay payment failed:', response.error);
        const err = new Error((response.error && response.error.description) || 'Payment transaction failed.');
        err.details = response.error;
        if (typeof onFailure === 'function') {
          onFailure(err);
        } else {
          alert('Payment Failed: ' + err.message);
        }
      });

      // Open checkout modal
      rzp.open();
      return rzp;
    }
  };

  window.VanviRazorpay = VanviRazorpay;
})(window);
