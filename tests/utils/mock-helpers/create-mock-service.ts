type MockServiceOptions = {
  name: string;
  methods: string[];
  implementation?: Record<string, jest.Mock>;
};

type MockServiceObject = Record<string, jest.Mock>;

export const createMockService = (options: MockServiceOptions): MockServiceObject => {
  const mockService: MockServiceObject = {};
  const { name, methods, implementation = {} } = options;

  methods.forEach(method => {
    if (implementation[method]) {
      mockService[method] = implementation[method];
    } else {
      mockService[method] = jest.fn().mockName(`${name}.${method}`);
    }
  });

  return mockService;
};

export const createAsyncMockService = (options: MockServiceOptions): MockServiceObject => {
  const mockService: MockServiceObject = {};
  const { name, methods, implementation = {} } = options;

  methods.forEach(method => {
    if (implementation[method]) {
      mockService[method] = implementation[method];
    } else {
      mockService[method] = jest.fn().mockName(`${name}.${method}`).mockResolvedValue(undefined);
    }
  });

  return mockService;
};

export const mockServiceResponse = <T>(data: T, delay = 0) => {
  return jest.fn().mockImplementation(() => 
    new Promise(resolve => setTimeout(() => resolve(data), delay))
  );
};

export const mockServiceError = (error: Error, delay = 0) => {
  return jest.fn().mockImplementation(() =>
    new Promise((_, reject) => setTimeout(() => reject(error), delay))
  );
}; 