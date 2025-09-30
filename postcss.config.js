import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const purgecss = require('@fullhuman/postcss-purgecss').default
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
const postcssPresetEnv = require('postcss-preset-env')

export default {
  plugins: [
    // Modern CSS features and browser compatibility
    postcssPresetEnv({
      stage: 2,
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
        'custom-properties': {
          preserve: false
        }
      }
    }),
    
    // Vendor prefixes
    autoprefixer({
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead'
      ],
      grid: 'autoplace'
    }),
    
    // Remove unused CSS (optimized safelist for chamber-controller)
    purgecss({
      content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
        './src/**/*.html'
      ],
      safelist: [
        // Vue Router and transitions
        /-(leave|enter|appear)(|-(to|from|active))$/,
        /^(?!(|.*?:)cursor-move).+-move$/,
        /^router-link(|-exact)-active$/,
        /data-v-.*/,
        
        // Layout classes actually used in chamber-controller
        'container-fluid',
        'align-center',
        'align-items-center',
        'd-none',
        'd-lg-flex',
        'text-center',
        'text-light',
        'text-white',
        
        // Navbar specific classes (heavily used)
        'navbar',
        'navbar-expand-lg', 
        'navbar-dark',
        'navbar-toggler',
        'navbar-toggler-icon',
        'navbar-brand',
        'navbar-collapse',
        'navbar-nav',
        'nav-item',
        'nav-link',
        'collapse',
        'vr',
        
        // Button classes
        /^btn(-.*)?$/,
        'btn-close',
        'btn-group',
        
        // Form classes (used in Bs components)
        'form-control',
        'form-control-plaintext',
        'form-check',
        'form-check-input',
        'form-switch',
        'form-label',
        'form-text',
        'input-group',
        'input-group-text',
        'has-validation',
        
        // Card classes
        'card',
        'card-body',
        'card-title',
        'card-text',
        /^card-header(-.*)?$/,
        
        // Alert classes
        /^alert(-.*)?$/,
        'alert-dismissible',
        
        // Badge classes
        /^badge(-.*)?$/,
        'text-bg-danger',
        'text-bg-primary',
        'rounded-circle',
        'rounded-pill',
        
        // Progress bar
        'progress',
        'progress-bar',
        
        // Background and text utilities actually used
        'bg-primary',
        'bg-success',
        'bg-danger',
        'bg-warning',
        'bg-info',
        'fw-bold',
        
        // Spacing utilities actually used
        'pt-2',
        'mx-lg-2',
        /^h-\d+$/,
        
        // Width utilities
        /^w-\d+$/,
        
        // Form validation
        'needs-validation',
        'was-validated',
        'is-valid',
        'is-invalid',
        'valid-feedback',
        'invalid-feedback',
        
        // Link utilities (comprehensive)
        /^link(-.*)?$/,
        'link-primary',
        'link-offset-2',
        'link-underline-opacity-25',
        'link-underline-opacity-100-hover',
        
        // Height utilities
        /^h-\d+$/,
        'h-25',
        'h-50', 
        'h-75',
        'h-100',
        'h-200',
        
        // Interactive states
        'active',
        'disabled', 
        'show',
        'hide',
        'fade',
        'collapse',
        'collapsed',
        'collapsing',
        'modal-backdrop'
      ],
      // Enhanced extraction to catch more classes
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      // Remove unused CSS variables and keyframes for better optimization
      variables: true,
      keyframes: true
    }),
    
    // Remove charset declarations
    {
      postcssPlugin: 'internal:charset-removal',
      AtRule: {
        charset: (atRule) => {
          if (atRule.name === 'charset') {
            atRule.remove();
          }
        }
      }
    },
    
    // Advanced CSS minification (must be last)
    cssnano({
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        mergeLonghand: true,
        mergeRules: true,
        minifySelectors: true,
        reduceTransforms: true,
        normalizeUrl: false, // Keep URLs as-is to avoid breaking paths
        svgo: false // Disable SVG optimization to avoid breaking inline SVGs
      }]
    })
  ]
}