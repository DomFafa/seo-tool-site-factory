export default {
  id: 'speedtype-theme',
  layout: 'dashboard',
  density: 'comfortable',
  radius: 'lg',
  typography: {
    heading: 'compact',
    body: 'readable'
  },
  hero: {
    variant: 'minimal'
  },
  toolSurface: {
    variant: 'card'
  },
  resultPanel: {
    variant: 'dashboard'
  },
  ads: {
    afterToolSpacing: 'large',
    sidebar: false
  }
} as const;
