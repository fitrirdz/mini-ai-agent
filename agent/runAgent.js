const weatherTool = require('../tools/weatherTool');
const searchTool = require('../tools/searchTool');

function fakeLLM(userInput) {
  const input = userInput.toLowerCase();

  // simulate reasoning
  if (input.includes('weather')) {
    return {
      action: 'USE_WEATHER_TOOL',
    };
  }

  if (input.includes('react') || input.includes('server components')) {
    return {
      action: 'USE_SEARCH_TOOL',
      query: userInput,
    };
  }

  return {
    action: 'DIRECT_RESPONSE',
    response: 'I can answer directly.',
  };
}

function runAgent(userInput) {
  console.log('\n===================');
  console.log('USER: ', userInput);

  // STEP 1 -> Think
  const decision = fakeLLM(userInput);

  console.log('Agent decision: ', decision);

  // STEP 2 -> Act
  if (decision.action === 'USE_WEATHER_TOOL') {
    const result = weatherTool();

    return {
      response: result,
    };
  }

  if (decision.action === 'USE_SEARCH_TOOL') {
    const result = searchTool(decision.query);

    return {
      response: result,
    };
  }

  // STEP 3 -> Respond
  return {
    response: decision.response,
  };
}

module.exports = runAgent;