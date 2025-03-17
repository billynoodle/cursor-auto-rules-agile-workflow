const path = require('path');
const fs = require('fs');

function tryResolve(modulePath) {
  try {
    return require.resolve(modulePath);
  } catch {
    return null;
  }
}

function findClosestPackageJson(startPath) {
  let currentPath = startPath;
  while (currentPath !== path.parse(currentPath).root) {
    const packagePath = path.join(currentPath, 'package.json');
    if (fs.existsSync(packagePath)) {
      return packagePath;
    }
    currentPath = path.dirname(currentPath);
  }
  return null;
}

module.exports = (request, options) => {
  const { defaultResolver, basedir } = options;

  // Handle @client alias
  if (request.startsWith('@client/')) {
    const packagePath = findClosestPackageJson(basedir);
    if (!packagePath) {
      return defaultResolver(request, options);
    }

    const projectRoot = path.dirname(packagePath);
    const relativePath = request.replace('@client/', '');
    const possiblePaths = [
      path.join(projectRoot, 'client/src', relativePath),
      path.join(projectRoot, 'client/src', relativePath + '.ts'),
      path.join(projectRoot, 'client/src', relativePath + '.tsx'),
      path.join(projectRoot, 'client/src', relativePath, 'index.ts'),
      path.join(projectRoot, 'client/src', relativePath, 'index.tsx')
    ];

    for (const possiblePath of possiblePaths) {
      const resolved = tryResolve(possiblePath);
      if (resolved) {
        return resolved;
      }
    }
  }

  // Handle CSS modules
  if (request.endsWith('.css')) {
    return require.resolve('identity-obj-proxy');
  }

  // Default resolution
  return defaultResolver(request, options);
}; 