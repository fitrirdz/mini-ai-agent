function calculatorTool(expression) {
  console.log('🧮 Calculator tool called: ', expression);

  try {
    // NOTE: eval is not safe for production. use parser, math engine, or sandbox instead
    const result = eval(expression);

    return `Result: ${result}`;
  } catch {
    return 'Invalid calculation';
  }
}

module.exports = calculatorTool;
