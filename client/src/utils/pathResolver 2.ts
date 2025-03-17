import path from 'path';

const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV === 'development';

type PathSegments = string[];

class PathResolver {
  private static instance: PathResolver;
  private baseDir: string;

  private constructor() {
    this.baseDir = this.determineBaseDir();
  }

  static getInstance(): PathResolver {
    if (!PathResolver.instance) {
      PathResolver.instance = new PathResolver();
    }
    return PathResolver.instance;
  }

  private determineBaseDir(): string {
    if (isTest) {
      return path.resolve(process.cwd(), 'client');
    }
    if (isDev) {
      return path.resolve(process.cwd(), 'src');
    }
    return path.resolve(process.cwd());
  }

  resolveClientPath(...segments: PathSegments): string {
    const relativePath = segments.join('/');
    if (relativePath.startsWith('@client/')) {
      return this.resolveAliasPath(relativePath);
    }
    return relativePath;
  }

  private resolveAliasPath(aliasPath: string): string {
    const withoutAlias = aliasPath.replace('@client/', '');
    return path.join(this.baseDir, 'src', withoutAlias);
  }
}

export const resolveClientPath = (...segments: PathSegments): string => {
  return PathResolver.getInstance().resolveClientPath(...segments);
};

export const createImport = (path: string) => {
  const resolvedPath = resolveClientPath(path);
  return require(resolvedPath);
}; 