import fs from 'fs';
import path from 'path';

export interface FixtureOptions {
  basePath?: string;
  transform?: (data: any) => any;
}

const defaultOptions: Required<FixtureOptions> = {
  basePath: path.join(process.cwd(), 'tests', '__fixtures__'),
  transform: (data: any) => data,
};

export const loadFixture = <T = any>(
  fixturePath: string,
  options: FixtureOptions = {}
): T => {
  const { basePath, transform } = { ...defaultOptions, ...options };
  const fullPath = path.join(basePath, fixturePath);
  
  try {
    const fileContent = fs.readFileSync(fullPath, 'utf8');
    const data = JSON.parse(fileContent);
    return transform(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load fixture at ${fixturePath}: ${message}`);
  }
};

export const loadFixtures = <T = any>(
  fixturePaths: string[],
  options: FixtureOptions = {}
): T[] => {
  return fixturePaths.map(path => loadFixture<T>(path, options));
};

export const createFixture = <T = any>(
  data: T,
  fixturePath: string,
  options: FixtureOptions = {}
): void => {
  const { basePath } = { ...defaultOptions, ...options };
  const fullPath = path.join(basePath, fixturePath);
  
  try {
    const dirPath = path.dirname(fullPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to create fixture at ${fixturePath}: ${message}`);
  }
};

export const clearFixtures = (
  fixturePaths: string[],
  options: FixtureOptions = {}
): void => {
  const { basePath } = { ...defaultOptions, ...options };
  
  fixturePaths.forEach(fixturePath => {
    const fullPath = path.join(basePath, fixturePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  });
}; 