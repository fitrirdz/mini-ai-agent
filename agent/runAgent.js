const weatherTool = require('../tools/weatherTool');
const searchTool = require('../tools/searchTool');
const { addToMemory, getMemory } = require('./memory');

function fakeLLM(state) {
  const goal = state.goal.toLowerCase();

  // STEP 1
  if (state.steps.length === 0) {
    if (goal.includes('react')) {
      return {
        action: 'SEARCH',
        query: 'React benefits',
      };
    }
  }

  // STEP 2
  if (state.steps.includes('SEARCH_DONE')) {
    return {
      action: 'SUMMARIZE',
    };
  }

  // FINAL
  return {
    action: 'FINNISH',
    answer:
      'React helps build reusable UI and improves development efficiency.',
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
