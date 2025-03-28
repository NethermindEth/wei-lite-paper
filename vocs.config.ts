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
      allowedHosts: ['*']
    }
  },
  
  logoUrl: '/chaoschain-logo.png',
  iconUrl: '/favicon.ico',
  
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
      text: 'Technical Architecture',
      items: [
        { text: 'Overview', link: '/technical-architecture/' },
        { text: 'Node Architecture', link: '/technical-architecture/node' },
        { text: 'Chain Identity System', link: '/technical-architecture/chain-identity' },
        { 
          text: 'L1 Integration',
          items: [
            { text: 'Overview', link: '/technical-architecture/l1-integration/' },
            { text: 'Chain Registry Contract', link: '/technical-architecture/l1-integration/chain-registry' },
            { text: 'Bridge Contract', link: '/technical-architecture/l1-integration/bridge-contract' }
          ]
        },
        { 
          text: 'Node Modifications',
          items: [
            { text: 'Block Proposal and Voting', link: '/technical-architecture/node-modifications/block-proposal' },
            { text: 'Horizontal Scalability', link: '/technical-architecture/node-modifications/horizontal-scalability' },
            { text: 'Identity Module', link: '/technical-architecture/node-modifications/identity-module' },
            { text: 'Mempool Flexibility', link: '/technical-architecture/node-modifications/mempool-flexibility' },
          ]
        }
      ]
    },
    {
      text: 'Chain Management',
      items: [
        { text: 'Overview', link: '/chain-management/' },
        { text: 'Minimal Bootstrap Requirements', link: '/chain-management/bootstrap-requirements' },
        { text: 'Chain Creation', link: '/chain-management/creation' },
      ]
    },
    {
      text: 'Agent Ecosystem',
      items: [
        { text: 'Overview', link: '/agent-ecosystem/' },
        { text: 'Agent Registry', link: '/agent-ecosystem/registry' },
        { text: 'Agent Development', link: '/agent-ecosystem/development' },
      ]
    },
    {
      text: 'Academic Research',
      items: [
        { text: 'Overview', link: '/academic-research/' },
        {
          text: 'Governance Revolution',
          items: [
            { text: 'Overview', link: '/governance-revolution/' },
            { text: 'Current Problems', link: '/governance-revolution/current-problems' },
            { text: 'Agentic Governance', link: '/governance-revolution/agentic-governance' },
            { text: 'Governance as Compute', link: '/academic-research/compute-wars' },
            { text: 'Proof of Humanity', link: '/governance-revolution/proof-of-humanity' },
          ]
        },
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
        { text: 'Agent Development', link: '/agent-ecosystem/development' },
        { text: 'Chain Creation', link: '/chain-management/creation' },
        { 
          text: 'API Reference', 
          items: [
            { text: 'Common API Details', link: '/developer-resources/api/common-api-details' },
            { text: 'Agent Registry API', link: '/developer-resources/api/agent-registry-api' },
            { text: 'Identity API', link: '/developer-resources/api/identity-api' },
            { text: 'Chains API', link: '/developer-resources/api/chains-api' },
            { text: 'Agent Consensus API', link: '/developer-resources/api/agent-consensus-api' }
          ]
        }
      ]
    }
  ],
  
  theme: {
    accentColor: '#7C3AED',
    colorScheme: 'system'
  }
}) 