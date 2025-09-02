const plugin = require('tailwindcss/plugin')

module.exports = plugin(function ({ addUtilities, theme }) {
  addUtilities({
    '.animate-in': {
      'animation-name': 'enter',
      'animation-duration': '150ms',
      '--tw-enter-opacity': 'initial',
      '--tw-enter-scale': 'initial',
      '--tw-enter-rotate': 'initial',
      '--tw-enter-translate-x': 'initial',
      '--tw-enter-translate-y': 'initial',
    },
    '.animate-out': {
      'animation-name': 'exit',
      'animation-duration': '150ms',
      '--tw-exit-opacity': 'initial',
      '--tw-exit-scale': 'initial',
      '--tw-exit-rotate': 'initial',
      '--tw-exit-translate-x': 'initial',
      '--tw-exit-translate-y': 'initial',
    },
    '.fade-in-0': {
      '--tw-enter-opacity': '0',
    },
    '.fade-in': {
      '--tw-enter-opacity': '1',
    },
    '.fade-out-0': {
      '--tw-exit-opacity': '0',
    },
    '.fade-out': {
      '--tw-exit-opacity': '1',
    },
    '.zoom-in-95': {
      '--tw-enter-scale': '0.95',
    },
    '.zoom-in': {
      '--tw-enter-scale': '1',
    },
    '.zoom-out-95': {
      '--tw-exit-scale': '0.95',
    },
    '.zoom-out': {
      '--tw-exit-scale': '1',
    },
    '.slide-in-from-left-2': {
      '--tw-enter-translate-x': '-0.5rem',
    },
    '.slide-in-from-right-2': {
      '--tw-enter-translate-x': '0.5rem',
    },
    '.slide-in-from-top-2': {
      '--tw-enter-translate-y': '-0.5rem',
    },
    '.slide-in-from-bottom-2': {
      '--tw-enter-translate-y': '0.5rem',
    },
    '.slide-out-to-left-2': {
      '--tw-exit-translate-x': '-0.5rem',
    },
    '.slide-out-to-right-2': {
      '--tw-exit-translate-x': '0.5rem',
    },
    '.slide-out-to-top-2': {
      '--tw-exit-translate-y': '-0.5rem',
    },
    '.slide-out-to-bottom-2': {
      '--tw-exit-translate-y': '0.5rem',
    },
  })
})
