import axios from 'axios';

const LOGGING_ENDPOINT = process.env.LOG_API; // access log api from environment variables

// valid stack values
const allowedStacks = ['frontend', 'backend'];
const allowedLevels = ['debug', 'info', 'warn', 'error', 'fatal'];


const allowedPackages = {
  frontend: ['api', 'component', 'hook', 'page', 'state', 'style'],
  backend: ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'],
  shared: ['auth', 'config', 'middleware', 'utils'],
};

/**
 * Validates and sends a structured log to the log server.
 * @param {string} stack - "frontend" or "backend"
 * @param {string} level - One of "debug", "info", "warn", "error", "fatal"
 * @param {string} packageName - Based on stack or shared list
 * @param {string} message - A clear and descriptive message
 */


export async function Log(stack, level, packageName, message) {

  // Normalize inputs to lowercase
  stack = stack.toLowerCase();
  level = level.toLowerCase();
  packageName = packageName.toLowerCase();

  // validate stack input
  if (!allowedStacks.includes(stack)) {
    throw new Error(`Invalid stack: "${stack}". Must be one of: ${allowedStacks.join(', ')}`);
  }

  // Validate level input
  if (!allowedLevels.includes(level)) {
    throw new Error(`Invalid level: "${level}". Must be one of: ${allowedLevels.join(', ')}`);
  }

  // Validate package input
  const stackPackages = allowedPackages[stack] || [];
  const isValidPackage = stackPackages.includes(packageName) || allowedPackages.shared.includes(packageName);

  if (!isValidPackage) {
    const valid = [...stackPackages, ...allowedPackages.shared].join(', ');
    throw new Error(`Invalid package: "${packageName}" for stack "${stack}". Must be one of: ${valid}`);
  }

  // make an api call to log api sending stack, level, packageName, and message
  try {
    const response = await axios.post(LOGGING_ENDPOINT, {
      stack,
      level,
      package: packageName,
      message,
    });

    console.log(`Log ID: ${response.data.logID}`);
  } catch (error) {
    console.error('Log Failed', error.message);
  }
}
