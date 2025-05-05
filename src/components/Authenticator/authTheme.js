import '../../App.css'

const theme = {
    name: 'custom-theme',
    tokens: {
      colors: {
        brand: {
          primary: {
            10: '#f2f4ef',
            40: '#c5cdb8',
            60: '#AAB493',
            80: '#8b9176',
            100: '#6c7359'
          },
          secondary: {
            60: '#6c757d',
            80: '#495057'
          }
        },
        background: {
          primary: '#ffffff',
          secondary: '#f8f9fa'
        },
        border: {
          primary: '#dee2e6',
          focus: '{colors.brand.primary.60}'
        },
        font: {
          primary: '#212529',
          secondary: '#6c757d',
          interactive: '{colors.brand.primary.60}'
        }
      },

      components: {
        authenticator: {
          router: {
            borderRadius: { value: '0' },
            boxShadow: { value: 'none' },
            backgroundColor: { value: 'transparent' },
            padding: { value: '2rem' }
          },
          container: {
            width: { value: '100%' },
            maxWidth: { value: '400px' },
            margin: { value: '0 auto' }
          }
        },
        button: {
          primary: {
            backgroundColor: { value: '{colors.brand.primary.60}' },
            color: { value: 'white' },
            borderRadius: { value: '4px' },
            fontSize: { value: '1rem' },
            fontWeight: { value: '500' },
            padding: { value: '0.75rem 1.5rem' },
            width: { value: '100%' },
            _hover: {
              backgroundColor: { value: '{colors.brand.primary.80}' }
            },
            _active: {
              backgroundColor: { value: '{colors.brand.primary.100}' }
            },
            _focus: {
              boxShadow: { value: '0 0 0 2px {colors.brand.primary.10}' }
            }
          }
        },
        field: {
          label: {
            color: { value: '{colors.font.primary}' },
            fontSize: { value: '0.875rem' },
            fontWeight: { value: '500' }
          },
          control: {
            borderRadius: { value: '4px' },
            borderColor: { value: '{colors.border.primary}' },
            fontSize: { value: '1rem' },
            _focus: {
              borderColor: { value: '{colors.border.focus}' },
              boxShadow: { value: '0 0 0 3px {colors.brand.primary.10}' }
            }
          }
        },
        // Tabs component styling
        tabs: {
          item: {
            color: { value: '{colors.font.secondary}' },
            _active: {
              color: { value: '{colors.font.interactive}' },
              borderColor: { value: '{colors.brand.primary.60}' }
            }
          }
        }
      }
    }
  }
  
export default theme
  