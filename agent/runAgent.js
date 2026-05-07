const weatherTool = require('../tools/weatherTool');
const searchTool = require('../tools/searchTool');
const { addToMemory, getMemory } = require('./memory');

function fakeLLM(userInput, history) {
  const input = userInput.toLowerCase();

  const previousConversation = history.map((item) => item.content).join(' ');
  console.log('Memory Context: ', previousConversation);

  // Weather
  if (input.includes('weather')) {
    return {
      action: 'USE_WEATHER_TOOL',
    };
  }

  // React related
  if (input.includes('react') || input.includes('server components')) {
    return {
      action: 'USE_SEARCH_TOOL',
      query: userInput,
    };
  }

  // Show Memory
  if (input.includes('show memory')) {
    return {
      action: 'USE_MEMORY_TOOL',
    };
  }

  //  Context follow-up detection
  if (input.includes('benefits') && previousConversation.includes('React')) {
    return {
      action: 'USE_SEARCH_TOOL',
      query: 'Benefits of react',
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

  // get previous context
  const history = getMemory();

  // set current context
  addToMemory('user', userInput);

  // STEP 1 -> Think
  const decision = fakeLLM(userInput, history);

  console.log('Agent decision: ', decision);

  // STEP 2 -> Act
  if (decision.action === 'USE_WEATHER_TOOL') {
    const result = weatherTool();

    // set new context
    addToMemory('assistant', result);
    return {
      response: result,
    };
  }

  if (decision.action === 'USE_SEARCH_TOOL') {
    const result = searchTool(decision.query);

    // set new context
    addToMemory('assistant', result);
    return {
      response: result,
    };
  }

  if (decision.action === 'USE_MEMORY_TOOL') {
    const result = getMemory();

    return result;
  }

  // set new context
  addToMemory('assistant', decision.response);
  // STEP 3 -> Respond
  return {
    response: decision.response,
  };
}

module.exports = runAgent;
