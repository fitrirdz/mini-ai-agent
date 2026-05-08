function createAgentState(userInput) {
  return {
    goal: userInput,
    steps: [],
    observations: [],
    finished: false,
    finalAnswer: null,
  };
}

module.exports = createAgentState;
