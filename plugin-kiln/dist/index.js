// src/actions/getStakingStats.ts
import {
  elizaLogger
} from "@elizaos/core";

// src/environment.ts
import { z } from "zod";
var kilnEnvSchema = z.object({
  KILN_API_KEY: z.string().min(1, "Kiln API key is required")
});
async function validateKilnConfig(runtime) {
  try {
    const config = {
      KILN_API_KEY: runtime.getSetting("KILN_API_KEY")
    };
    console.log("config: ", config);
    return kilnEnvSchema.parse(config);
  } catch (error) {
    console.log("error::::", error);
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n");
      throw new Error(
        `Kiln API configuration validation failed:
${errorMessages}`
      );
    }
    throw error;
  }
}
var cookieEnvSchema = z.object({
  COOKIE_API_KEY: z.string().min(1, "Cookie API key is required")
});
async function validateCookieConfig(runtime) {
  try {
    const config = {
      COOKIE_API_KEY: runtime.getSetting("COOKIE_API_KEY")
    };
    console.log("config: ", config);
    return cookieEnvSchema.parse(config);
  } catch (error) {
    console.log("error::::", error);
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n");
      throw new Error(
        `Cookie API configuration validation failed:
${errorMessages}`
      );
    }
    throw error;
  }
}

// src/examples.ts
var getStakingStatisticsExamples = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "I wonder what are the most profitable staking options today?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "",
        action: "KILN_GET_STAKING_STATISTICS"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Can you give information about the APY of various blockchains?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "",
        action: "KILN_GET_STAKING_STATISTICS"
      }
    }
  ]
];
var getVaultsExamples = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "What are Kiln's Vaults addresses?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "",
        action: "KILN_GET_VAULT"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "How can i use Kiln's staking solutions?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "",
        action: "KILN_GET_VAULT"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Pick one vault and transfer my funds."
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "Sure!"
      }
    }
  ]
];
var getTrendingAgentsExamples = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "Who are the best AI Agent at the moment?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "",
        action: "COOKIE_GET_TRENDING"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "On which twitter agent should I invest?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "",
        action: "COOKIE_GET_TRENDING"
      }
    }
  ]
];

// src/services.ts
var BASE_URLS = [
  "https://api.kiln.fi/v1/eth/network-stats",
  "https://api.kiln.fi/v1/ada/network-stats",
  "https://api.kiln.fi/v1/tia/network-stats",
  "https://api.kiln.fi/v1/atom/network-stats",
  "https://api.kiln.fi/v1/dydx/network-stats",
  "https://api.kiln.fi/v1/fet/network-stats",
  "https://api.kiln.fi/v1/inj/network-stats",
  "https://api.kiln.fi/v1/kava/network-stats",
  "https://api.kiln.fi/v1/ksm/network-stats",
  "https://api.kiln.fi/v1/egld/network-stats",
  "https://api.kiln.fi/v1/near/network-stats",
  "https://api.kiln.fi/v1/osmo/network-stats",
  "https://api.kiln.fi/v1/dot/network-stats",
  "https://api.kiln.fi/v1/pol/network-stats",
  "https://api.kiln.fi/v1/sol/network-stats",
  "https://api.kiln.fi/v1/xtz/network-stats",
  "https://api.kiln.fi/v1/zeta/network-stats"
];
var COOKIE_URL = "https://api.cookie.fun/v2/agents/agentsPaged?interval=_7Days&page=1&pageSize=5";
var createKilnService = (apiKey) => {
  const extractChain = (url) => {
    const matches = url.match(/\/v1\/([^/]+)\/network-stats/);
    return matches ? matches[1] : "";
  };
  const fetchNetworkStats = async (url) => {
    try {
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message || response.statusText);
      }
      const data = await response.json();
      data.chain = extractChain(url);
      return data;
    } catch (error) {
      console.error(`Kiln API Error for ${url}:`, error.message);
      throw error;
    }
  };
  const getStakingStatistics = async () => {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    try {
      const results = await Promise.allSettled(
        BASE_URLS.map((url) => fetchNetworkStats(url))
      );
      const successfulResults = results.filter(
        (result) => result.status === "fulfilled"
      ).map((result) => result.value);
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(`Failed to fetch data for ${BASE_URLS[index]}:`, result.reason);
        }
      });
      return successfulResults;
    } catch (error) {
      console.error("Kiln Service Error:", error.message);
      throw error;
    }
  };
  return { getStakingStatistics };
};
var createCookieService = (apiKey) => {
  const getTradingAgents = async () => {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    try {
      const response = await fetch(COOKIE_URL, {
        headers: {
          "x-api-key": `${apiKey}`
        }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message || response.statusText);
      }
      return await response.json();
    } catch (error) {
      console.error("Cookie Service Error:", error.message);
      throw error;
    }
  };
  return { getTradingAgents };
};

// src/actions/getStakingStats.ts
var getStakingStatisticsAction = {
  name: "KILN_GET_STAKING_STATISTICS",
  similes: [
    "STAKING_STATISTICS",
    "STAKING",
    "APY",
    "ANNUAL_PERCENTAGE_YIELD"
  ],
  description: "Get statistics about staking revenue on different blockchains",
  validate: async (runtime) => {
    await validateKilnConfig(runtime);
    return true;
  },
  handler: async (runtime, message, state, _options, callback) => {
    const config = await validateKilnConfig(runtime);
    const kilnService = createKilnService(
      config.KILN_API_KEY
    );
    try {
      const StakingStatsData = await kilnService.getStakingStatistics();
      elizaLogger.success(
        `Successfully fetched StakingStats`
      );
      if (callback) {
        const combinedText = StakingStatsData.map(
          (stakingData) => `${stakingData.chain.toUpperCase()} :\r
 - ${stakingData.data.nb_validators} validators.\r
 - ${stakingData.data.network_gross_apy.toFixed(2)}% of gross APY`
        ).join("\r\n");
        callback({
          text: `Here are statistics about staking on different chains :\r
${combinedText}`
        });
        return true;
      }
    } catch (error) {
      elizaLogger.error("Error in Kiln plugin handler:", error);
      callback({
        text: `Error fetching Staking Statistics: ${error.message}`,
        content: { error: error.message }
      });
      return false;
    }
  },
  examples: getStakingStatisticsExamples
};

// src/actions/getVaults.ts
import {
  elizaLogger as elizaLogger2
} from "@elizaos/core";
var getVaultAction = {
  name: "KILN_GET_VAULT",
  similes: [
    "VAULT",
    "KILN STAKING SOLUTIONS",
    "ERC-4626"
  ],
  description: "Get all Kiln's vaults",
  validate: async (runtime) => {
    await validateKilnConfig(runtime);
    return true;
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      if (callback) {
        const text = "- Aave v3 => USDC : 0xdea01fc5289af2c440ca65582e3c44767c0fcf08\r\n- Aave v3 => USDC : 0x9b80443f910832a6eed6cef5b95bd9d1dae424b5\r\n- Aave v3 => USDC : 0x682cfc8a3d956fba2c40791ec8d5a49e13baafbd\r\n- Aave v3 => USDC : 0x85fbdc49b2e7b9e07468733873c8f199fc44259f\r\n- Compound v3 => USDC : 0xf3a9A790f84B2E0301069BE589fc976Cf3eB5661";
        callback({
          text: `Here is a list of Kiln's Vaults :\r
 ${text}`
        });
        return true;
      }
    } catch (error) {
      elizaLogger2.error("Error in Kiln plugin handler:", error);
      callback({
        text: `Error displaying Kiln's vaults: ${error.message}`,
        content: { error: error.message }
      });
      return false;
    }
  },
  examples: getVaultsExamples
};

// src/actions/getTrendingAgents.ts
import {
  elizaLogger as elizaLogger3
} from "@elizaos/core";
var formatNumber = (value) => {
  if (value === null || typeof value !== "number") {
    return "N/A";
  }
  return value.toFixed(2);
};
var formatAgentMetrics = (agent) => {
  const twitterHandle = agent.twitterUsernames?.[0] || "N/A";
  const metrics = [
    `[MarketCap]=>${formatNumber(agent.marketCap)}`,
    `[Price]=>${formatNumber(agent.price)}$`,
    `[Liquidity]=>${formatNumber(agent.liquidity)}`
  ].join(" | ");
  const stats = [
    `Volume last 24 hours : ${formatNumber(agent.volume24Hours)}`,
    `~Impression Count : ${formatNumber(agent.averageImpressionCount)}`,
    `~Engagements Count : ${formatNumber(agent.averageEngagementsCount)}`,
    `[Followers]=>${agent.followersCount || "N/A"}`
  ].join("\r\n");
  return [
    `AI Agent Name : ${agent.agentName || "N/A"} => @${twitterHandle}`,
    metrics,
    stats
  ].join("\r\n");
};
var getTrendingAgentsAction = {
  name: "COOKIE_GET_TRENDING",
  similes: [
    "TWITTER_AGENT",
    "BEST_AI_AGENT"
  ],
  description: "Get trending AI agents",
  validate: async (runtime) => {
    await validateCookieConfig(runtime);
    return true;
  },
  handler: async (runtime, message, state, _options, callback) => {
    const config = await validateCookieConfig(runtime);
    const cookieService = createCookieService(config.COOKIE_API_KEY);
    try {
      const trendingAgents = await cookieService.getTradingAgents();
      elizaLogger3.success("Successfully fetched Trending Agents");
      if (callback && trendingAgents?.ok?.data) {
        const formattedAgents = trendingAgents.ok.data.map(formatAgentMetrics).join("\r\n\r\n");
        callback({
          text: `Here are actual trending ai agents:\r
${formattedAgents}`
        });
        return true;
      }
      return false;
    } catch (error) {
      elizaLogger3.error("Error in Cookie plugin handler:", error);
      callback({
        text: `Error fetching Trending Agents: ${error.message}`,
        content: { error: error.message }
      });
      return false;
    }
  },
  examples: getTrendingAgentsExamples
};

// src/index.ts
var kilnPlugin = {
  name: "kiln",
  description: "Kiln plugin for Eliza",
  actions: [getStakingStatisticsAction, getVaultAction, getTrendingAgentsAction],
  // evaluators analyze the situations and actions taken by the agent. they run after each agent action
  // allowing the agent to reflect on what happened and potentially trigger additional actions or modifications
  evaluators: [],
  // providers supply information and state to the agent's context, help agent access necessary data
  providers: []
};
var index_default = kilnPlugin;
export {
  index_default as default,
  kilnPlugin
};
//# sourceMappingURL=index.js.map