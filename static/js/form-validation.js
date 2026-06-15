/**
 * Client-side validation for the contact form.
 * Visual feedback only after a field is touched (blur) or on submit.
 */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) {
        return;
    }

    const FIELD_ORDER = ['name', 'email', 'phone', 'subject', 'message'];
    const touched = {};

    const fields = {
        name: {
            element: document.getElementById('id_name'),
            errorEl: document.getElementById('error-name'),
            validate: (value) => {
                if (value.trim().length < 2) {
                    return { valid: false, message: 'Nama minimal 2 karakter.' };
                }
                return { valid: true };
            },
        },
        email: {
            element: document.getElementById('id_email'),
            errorEl: document.getElementById('error-email'),
            validate: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value.trim())) {
                    return { valid: false, message: 'Format email tidak valid.' };
                }
                return { valid: true };
            },
        },
        phone: {
            element: document.getElementById('id_phone'),
            errorEl: document.getElementById('error-phone'),
            validate: (value) => {
                const trimmed = value.trim();
                if (!trimmed) {
                    return { valid: true };
                }
                const sanitized = trimmed.replace(/[\s\-()]/g, '');
                const phoneRegex = /^(\+62|62|0)8[0-9]{8,11}$/;
                if (!phoneRegex.test(sanitized)) {
                    return { valid: false, message: 'Format nomor HP tidak valid. Gunakan 08xx atau +62xx.' };
                }
                return { valid: true };
            },
        },
        subject: {
            element: document.getElementById('id_subject'),
            errorEl: document.getElementById('error-subject'),
            validate: (value) => {
                if (value.trim().length < 5) {
                    return { valid: false, message: 'Subject minimal 5 karakter.' };
                }
                return { valid: true };
            },
        },
        message: {
            element: document.getElementById('id_message'),
            errorEl: document.getElementById('error-message'),
            counterEl: document.getElementById('message-counter'),
            validate: (value) => {
                const length = value.trim().length;
                if (length < 20) {
                    const remaining = 20 - length;
                    return {
                        valid: false,
                        message: `Pesan minimal 20 karakter. Sisa ${remaining} karakter.`,
                    };
                }
                return { valid: true };
            },
        },
    };

    const PHONE_ALLOWED_KEYS = new Set([
        'Backspace',
        'Delete',
        'Tab',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
    ]);

    /**
     * Update char counter without triggering validation visuals.
     */
    function updateMessageCounter(key) {
        const { element, counterEl } = fields[key];
        if (!element || !counterEl) {
            return;
        }
        const length = element.value.trim().length;
        counterEl.textContent = `${length}/20 karakter`;
    }

    /**
     * Validate a field and optionally update visual state.
     */
    function updateFieldVisual(key) {
        const config = fields[key];
        const { element, errorEl, validate } = config;
        if (!element) {
            return { valid: true };
        }

        const result = validate(element.value);

        if (!touched[key]) {
            element.classList.remove('error');
            if (errorEl) {
                errorEl.textContent = '';
            }
            return result;
        }

        if (result.valid) {
            element.classList.remove('error');
            if (errorEl) {
                errorEl.textContent = '';
            }
        } else {
            element.classList.add('error');
            if (errorEl) {
                errorEl.textContent = result.message;
            }
        }

        return result;
    }

    FIELD_ORDER.forEach((key) => {
        const { element } = fields[key];
        if (!element) {
            return;
        }

        element.addEventListener('blur', () => {
            touched[key] = true;
            updateFieldVisual(key);
        });

        element.addEventListener('input', () => {
            if (key === 'phone') {
                element.value = element.value.replace(/[^0-9+]/g, '');
            }

            if (key === 'message') {
                updateMessageCounter(key);
            }

            if (touched[key]) {
                updateFieldVisual(key);
            }
        });

        if (key === 'phone') {
            element.addEventListener('keydown', (e) => {
                if (PHONE_ALLOWED_KEYS.has(e.key)) {
                    return;
                }
                if (e.key >= '0' && e.key <= '9') {
                    return;
                }
                if (e.key === '+') {
                    return;
                }
                e.preventDefault();
            });
        }
    });

    form.addEventListener('submit', (e) => {
        FIELD_ORDER.forEach((key) => {
            touched[key] = true;
        });

        let firstInvalidField = null;

        for (const key of FIELD_ORDER) {
            const result = updateFieldVisual(key);
            if (!result.valid && !firstInvalidField) {
                firstInvalidField = fields[key].element;
            }
        }

        if (firstInvalidField) {
            e.preventDefault();
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalidField.focus();
        }
    });
});
