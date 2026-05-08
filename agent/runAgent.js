const searchTool = require('../tools/searchTool');
const createAgentState = require('./agentState');
const calculatorTool = require('../tools/calculatorTool');

function fakeLLM(state) {
  const goal = state.goal.toLowerCase();

  // SEARCH
  if (goal.includes('react') && !state.steps.includes('SEARCH_DONE')) {
    return {
      action: 'SEARCH',
      query: 'React benefits',
    };
  }

  // WEATHER
  if (goal.includes('weather') && !state.steps.includes('WEATHER_DONE')) {
    return {
      action: 'WEATHER',
    };
  }

  // CALCULATOR
  if (
    goal.includes('calculator') &&
    !state.steps.includes('CALCULATION_DONE')
  ) {
    return {
      action: 'CALCULATE',
      expression: '5 + 5',
    };
  }

  // SUMMARIZE SEARCH RESULT
  if (
    state.steps.includes('SEARCH_DONE') &&
    !state.steps.includes('SUMMARY_DONE')
  ) {
    return {
      action: 'SUMMARIZE',
    };
  }

  // FINAL
  return {
    action: 'FINISH',
    answer: 'Task completed successfully',
  };
}

function runAgent(userInput) {
  const state = createAgentState(userInput);

  console.log('\n🤖 Agent Started');
  console.log('🎯 Goal: ', state.goal);

  while (!state.finished) {
    console.log('\n🧠 Thinking . . .');

    const decision = fakeLLM(state);

    console.log('👉 Decision: ', decision);

    // SEARCH
    if (decision.action === 'SEARCH') {
      const result = searchTool(decision.query);

      state.observations.push(result);
      state.steps.push('SEARCH_DONE');

      console.log('🔍 Observation saved');

      continue;
    }

    // SUMMARIZE
    if (decision.action === 'SUMMARIZE') {
      console.log('📝 Summarizing observations');

      state.steps.push('SUMMARY_DONE');

      continue;
    }

    // FINISH
    if (decision.action === 'FINISH') {
      state.finished = true;
      state.finalAnswer = decision.answer;
    }
  }

  console.log('\n✅ Agent Finished');

  return {
    response: state.finalAnswer,
    state,
  };
}

module.exports = runAgent;
