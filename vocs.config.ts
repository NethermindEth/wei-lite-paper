import { defineConfig } from 'vocs'

export default defineConfig({
  title: 'ChaosChain',
  description: 'The future of governance is a computational arms race',
  
  rootDir: './docs',
  basePath: '',
  
  // Configure Vite to allow external hosts
  vite: {
    server: {
      host: true,
      cors: true,
      hmr: { clientPort: 443 },
      allowedHosts: ['62aa-185-96-222-3.ngrok-free.app']
    }
  },
  
  socials: [
    {
      icon: 'github',
      link: 'https://github.com/chaoschain'
    },
    {
      icon: 'telegram',
      link: 'https://t.me/thechaoschain'
    }
  ],
  
  sidebar: [
    {
      text: 'Introduction',
      items: [
        { text: 'Overview', link: '/introduction/' },
        { text: 'Vision and Mission', link: '/introduction/vision' },
        { text: 'Compute Governance Thesis', link: '/introduction/compute-thesis' },
        { text: 'Self-Evolving Chain', link: '/introduction/self-evolving-chain' },
      ]
    },
    {
      text: 'Governance Revolution',
      items: [
        { text: 'Overview', link: '/governance-revolution/' },
        { text: 'Current Problems', link: '/governance-revolution/current-problems' },
        { text: 'Agentic Governance', link: '/governance-revolution/agentic-governance' },
        { text: 'Governance as Compute', link: '/governance-revolution/compute-game' },
        { text: 'Proof of Humanity', link: '/governance-revolution/proof-of-humanity' },
      ]
    },
    {
      text: 'Technical Architecture',
      items: [
        { text: 'Overview', link: '/technical-architecture/' },
        { text: 'Node Architecture', link: '/technical-architecture/node' },
        { text: 'L1 Contract', link: '/technical-architecture/l1-contract' },
        { text: 'Identity Module', link: '/technical-architecture/identity' },
        { text: 'Agent API', link: '/technical-architecture/api' },
      ]
    },
    {
      text: 'Agent Ecosystem',
      items: [
        { text: 'Overview', link: '/agent-ecosystem/' },
        { text: 'Agent Registry', link: '/agent-ecosystem/registry' },
        { text: 'Agent Types', link: '/agent-ecosystem/types' },
        { text: 'Compute Strategies', link: '/agent-ecosystem/compute' },
        { text: 'Security Considerations', link: '/agent-ecosystem/security' },
      ]
    },
    {
      text: 'Academic Research',
      items: [
        { text: 'Overview', link: '/academic-research/' },
        { text: 'Compute Wars Thesis', link: '/academic-research/compute-wars' },
        { text: 'Security Research', link: '/academic-research/security' },
        { text: 'Societal Implications', link: '/academic-research/societal' },
        { text: 'Technical Research', link: '/academic-research/technical' },
      ]
    },
    {
      text: 'Roadmap',
      link: '/roadmap/'
    },
    {
      text: 'Developer Resources',
      items: [
        { text: 'Overview', link: '/developer-resources/' },
        { text: 'Node Operation', link: '/developer-resources/node' },
        { text: 'Agent Development', link: '/developer-resources/agent' },
        { text: 'Chain Creation', link: '/developer-resources/chain' },
        { text: 'API Reference', link: '/developer-resources/api' },
      ]
    }
  ],
  
  theme: {
    accentColor: '#7C3AED',
    colorScheme: 'system'
  }
}) 