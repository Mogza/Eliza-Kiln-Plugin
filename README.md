# Plugin Kiln  
A plugin for fetching data from the Kiln Connect API.

This project is a plugin of [Eliza](https://github.com/elizaOS/eliza)

This plugin uses the [Kiln Connect API](https://docs.api.kiln.fi/reference). Please refer to their documentation for detailed information about rate limits, available endpoints, and response formats.

# Why
From January 31st to February 2nd 2025, I participated in Kiln's Hackathon. During this weekend, I explored the emerging Web3 narrative around AI Agents. My team developed a custom plugin that enables our AI agent to interact with Kiln Connect's API. After such a rewarding experience, I've decided to continue developing this project.

# Configuration
Set up your environment with the required Kiln Connect API key:
| Variable Name | Description |
|---|---|
| KILN_API_KEY | Your Kiln Connect API key |

# Actions
### KILN_GET_STAKING_STATISTICS
Fetches some network statistics on staking on different networks.   
Features :
- Network Gross APY percentage
- Number of validators
  
Examples :
- "I wonder what are the most profitable staking options today?"
- "Can you give information about the APY of various blockchains?"
