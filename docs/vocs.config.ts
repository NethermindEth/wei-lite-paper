import { defineConfig } from 'vocs'

export default defineConfig({
  title: 'ChaosChain',
  sidebar: {
    '/lite-paper/': [
      {
        text: 'Lite Paper',
        items: [
          {
            text: 'Vision and Mission',
            link: '/lite-paper/vision'
          },
          {
            text: 'Approach',
            items: [
              {
                text: 'Ethereum Agentic Core Development',
                link: '/lite-paper/approach/ethereum-core-dev'
              },
              {
                text: 'Customizable L2s Launchpad',
                link: '/lite-paper/approach/l2-launchpad'
              },
              {
                text: 'Core Dev DAO Support',
                link: '/lite-paper/approach/dao-support'
              }
            ]
          },
          {
            text: 'Research Questions',
            link: '/lite-paper/research'
          }
        ]
      }
    ],
    '/technical/': [
      {
        text: 'Technical Documentation',
        items: [
          {
            text: 'Overview',
            link: '/technical/overview'
          },
          {
            text: 'Agent Development',
            items: [
              {
                text: 'Architecture',
                link: '/technical/architecture'
              },
              {
                text: 'Knowledge Systems',
                link: '/technical/knowledge'
              },
              {
                text: 'Learning Mechanisms',
                link: '/technical/learning'
              }
            ]
          },
          {
            text: 'Protocol Integration',
            items: [
              {
                text: 'Interfaces',
                link: '/technical/interfaces'
              },
              {
                text: 'Verification',
                link: '/technical/verification'
              },
              {
                text: 'Security',
                link: '/technical/security'
              }
            ]
          },
          {
            text: 'Community Systems',
            items: [
              {
                text: 'Coordination',
                link: '/technical/coordination'
              },
              {
                text: 'Governance',
                link: '/technical/governance'
              },
              {
                text: 'Incentives',
                link: '/technical/incentives'
              }
            ]
          },
          {
            text: 'Development Guide',
            link: '/technical/guide'
          }
        ]
      }
    ]
  }
}) 