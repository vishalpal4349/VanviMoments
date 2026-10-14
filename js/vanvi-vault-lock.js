/**
 * VANVI MOMENTS — LUXURY VAULT LOCK (COMPLETELY UNLOCKED)
 * All templates and experiences are permanently unlocked for full creation and preview.
 */
(function(window) {
  'use strict';

  const VanviVault = {
    unlockedIds: {
      has: function() { return true; }
    },

    isUnlocked: function() {
      return true; // Permanently unlocked for all users
    },

    init: function() {
      // No locking
    },

    openModal: function() {
      // No modal
    },

    closeModal: function() {
      // No modal
    },

    scanAndLockCards: function() {
      // Disabled: all templates are 100% active and unlocked
    },

    applyLockToCard: function() {
      // Disabled
    }
  };

  window.VanviVault = VanviVault;
})(typeof window !== 'undefined' ? window : this);
