const HealthPrompt = {
    userPrompt: (query) => `User: ${query}\nAssistant:`,
};

console.log(HealthPrompt.userPrompt("Test query"));
