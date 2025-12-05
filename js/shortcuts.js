/**
 * Keyboard shortcuts system
 * @module shortcuts
 */

import { toggleTheme } from './theme.js';
import { createElement, setTextContent } from './utils.js';

/** Shortcuts configuration */
const SHORTCUTS = [
    { key: 't', description: 'Переключить тему', action: toggleTheme },
    { key: 'Home', description: 'В начало страницы', action: () => scrollToTop() },
    { key: 'End', description: 'В конец страницы', action: () => scrollToBottom() },
    { key: '1', description: 'Twitch секция', action: () => scrollToSection('twitch-section') },
    { key: '2', description: 'Telegram секция', action: () => scrollToSection('telegram-section') },
    { key: '3', description: 'Discord секция', action: () => scrollToSection('discord-section') },
    { key: '4', description: 'Навыки', action: () => scrollToSection('skills-section') },
    { key: '5', description: 'Timeline', action: () => scrollToSection('timeline-section') },
    { key: '/', description: 'Фокус на поиск', action: () => focusSearch(), preventDefault: true },
    { key: 'Escape', description: 'Очистить поиск / закрыть', action: () => handleEscape() },
    { key: '?', description: 'Показать справку', action: () => toggleHelpModal(), shift: true }
];

/** Help modal element */
let helpModal = null;

/**
 * Scroll to top smoothly
 */
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Scroll to bottom smoothly
 */
function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

/**
 * Scroll to section by ID
 * @param {string} sectionId - Section element ID
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Focus search input
 */
function focusSearch() {
    const searchInput = document.querySelector('.filter-search');
    if (searchInput) {
        searchInput.focus();
        searchInput.select();
    }
}

/**
 * Handle escape key
 */
function handleEscape() {
    // Close help modal if open
    if (helpModal && helpModal.classList.contains('modal-visible')) {
        hideHelpModal();
        return;
    }

    // Clear search inputs
    document.querySelectorAll('.filter-search').forEach(input => {
        if (input.value) {
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
}

/**
 * Create help modal
 * @returns {HTMLElement} Modal element
 */
function createHelpModal() {
    const modal = createElement('div', 'modal shortcuts-modal');
    modal.id = 'shortcuts-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'shortcuts-title');
    modal.setAttribute('aria-hidden', 'true');

    const content = createElement('div', 'modal-content');

    // Header
    const header = createElement('div', 'modal-header');
    const title = createElement('h3', 'modal-title');
    title.id = 'shortcuts-title';
    setTextContent(title, 'Горячие клавиши');

    const closeBtn = createElement('button', 'modal-close');
    const closeIcon = createElement('i', 'fa-solid fa-times');
    closeBtn.appendChild(closeIcon);
    closeBtn.setAttribute('aria-label', 'Закрыть');
    closeBtn.addEventListener('click', hideHelpModal);

    header.appendChild(title);
    header.appendChild(closeBtn);
    content.appendChild(header);

    // Shortcuts list
    const list = createElement('div', 'shortcuts-list');

    SHORTCUTS.filter(s => s.key !== 'Escape').forEach(shortcut => {
        const item = createElement('div', 'shortcut-item');

        const keyEl = createElement('kbd', 'shortcut-key');
        let keyText = shortcut.key;
        if (shortcut.shift) keyText = 'Shift + ' + keyText;
        if (shortcut.ctrl) keyText = 'Ctrl + ' + keyText;
        setTextContent(keyEl, keyText);

        const desc = createElement('span', 'shortcut-description');
        setTextContent(desc, shortcut.description);

        item.appendChild(keyEl);
        item.appendChild(desc);
        list.appendChild(item);
    });

    content.appendChild(list);
    modal.appendChild(content);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideHelpModal();
    });

    document.body.appendChild(modal);
    return modal;
}

/**
 * Show help modal
 */
function showHelpModal() {
    if (!helpModal) {
        helpModal = createHelpModal();
    }

    helpModal.classList.add('modal-visible');
    helpModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button
    const closeBtn = helpModal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
}

/**
 * Hide help modal
 */
function hideHelpModal() {
    if (helpModal) {
        helpModal.classList.remove('modal-visible');
        helpModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

/**
 * Toggle help modal
 */
function toggleHelpModal() {
    if (helpModal && helpModal.classList.contains('modal-visible')) {
        hideHelpModal();
    } else {
        showHelpModal();
    }
}

/**
 * Handle keydown event
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeydown(e) {
    // Ignore if typing in input/textarea
    if (e.target.matches('input, textarea, [contenteditable]')) {
        // Allow Escape in inputs
        if (e.key !== 'Escape') return;
    }

    const shortcut = SHORTCUTS.find(s => {
        if (s.key.toLowerCase() !== e.key.toLowerCase()) return false;
        if (s.shift && !e.shiftKey) return false;
        if (s.ctrl && !e.ctrlKey) return false;
        if (!s.shift && e.shiftKey && s.key !== '?') return false;
        return true;
    });

    if (shortcut) {
        if (shortcut.preventDefault) e.preventDefault();
        shortcut.action();
    }
}

/**
 * Initialize keyboard shortcuts
 */
export function initShortcuts() {
    document.addEventListener('keydown', handleKeydown);
}

// Export for external access
export { showHelpModal, hideHelpModal };
