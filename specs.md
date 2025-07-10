# React App File Structure with Service Classes

## Recommended Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (buttons, inputs, etc.)
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.module.css
│   │   │   └── index.js
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── index.js     # Export all UI components
│   ├── common/          # Shared components across features
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Navigation/
│   │   └── LoadingSpinner/
│   └── forms/           # Form-specific components
│       ├── ImageUploadForm/
│       └── DetectionForm/
├── pages/               # Page components (route components)
│   ├── HomePage/
│   │   ├── HomePage.jsx
│   │   ├── HomePage.module.css
│   │   └── index.js
│   ├── DetectionPage/
│   ├── ResultsPage/
│   └── index.js
├── services/            # Service classes and API calls
│   ├── api/
│   │   ├── baseApi.js          # Base API configuration
│   │   ├── oilPalmApi.js       # Oil palm detection API
│   │   └── index.js
│   ├── storage/
│   │   ├── localStorage.js     # Local storage utilities
│   │   └── sessionStorage.js
│   ├── validation/
│   │   ├── imageValidator.js   # Image validation service
│   │   └── formValidator.js
│   ├── image/
│   │   ├── imageProcessor.js   # Image processing utilities
│   │   └── imageConverter.js
│   └── index.js         # Export all services
├── hooks/               # Custom React hooks
│   ├── useApi.js
│   ├── useImageUpload.js
│   ├── useDetection.js
│   └── index.js
├── context/             # React Context providers
│   ├── AppContext.js
│   ├── AuthContext.js
│   └── DetectionContext.js
├── utils/               # Utility functions
│   ├── constants.js     # App constants
│   ├── helpers.js       # Helper functions
│   ├── formatters.js    # Data formatting utilities
│   └── index.js
├── assets/              # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
├── styles/              # Global styles
│   ├── globals.css
│   ├── variables.css
│   └── components.css
├── types/               # TypeScript type definitions (if using TS)
│   ├── api.ts
│   ├── detection.ts
│   └── common.ts
├── App.jsx
├── App.css
├── index.js
└── index.css
```

## Key Service Classes Structure

### 1. API Services (`src/services/api/`)

```javascript
// baseApi.js
class BaseApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.timeout = 30000;
  }

  async request(endpoint, options = {}) {
    // Common API request logic
  }

  handleError(error) {
    // Error handling logic
  }
}

// oilPalmApi.js
class OilPalmApiService extends BaseApiService {
  constructor() {
    super('http://localhost:5000');
  }

  async detectFromFile(file) {
    // Detection from file upload
  }

  async detectFromUrl(url) {
    // Detection from URL
  }

  async getAnnotatedImage(file) {
    // Get annotated image
  }
}
```

### 2. Storage Services (`src/services/storage/`)

```javascript
// localStorage.js
class LocalStorageService {
  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  static getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }
}
```

### 3. Validation Services (`src/services/validation/`)

```javascript
// imageValidator.js
class ImageValidatorService {
  static validateFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG and PNG are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum 10MB allowed.');
    }

    return true;
  }

  static validateUrl(url) {
    // URL validation logic
  }
}
```

## Component Structure Example

### Feature-based Component Organization

```
src/components/detection/
├── DetectionContainer/
│   ├── DetectionContainer.jsx
│   ├── DetectionContainer.module.css
│   └── index.js
├── ImageUploader/
│   ├── ImageUploader.jsx
│   ├── ImageUploader.module.css
│   └── index.js
├── ResultsDisplay/
│   ├── ResultsDisplay.jsx
│   ├── ResultsDisplay.module.css
│   └── index.js
└── index.js
```

## Custom Hooks Structure

```javascript
// useDetection.js
import { useState } from 'react';
import { OilPalmApiService } from '../services';

export const useDetection = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const detectFromFile = async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const apiService = new OilPalmApiService();
      const results = await apiService.detectFromFile(file);
      setResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    results,
    error,
    detectFromFile
  };
};
```

## Benefits of This Structure

### 1. **Separation of Concerns**
- Components focus on UI rendering
- Services handle business logic and API calls
- Hooks manage state and side effects

### 2. **Reusability**
- Service classes can be used across different components
- UI components are modular and reusable
- Custom hooks encapsulate common logic

### 3. **Maintainability**
- Clear organization makes code easy to find and modify
- Service classes are easy to test in isolation
- Consistent patterns across the application

### 4. **Scalability**
- Easy to add new features without restructuring
- Service classes can be extended or composed
- Component hierarchy supports growth

## Additional Recommendations

### 1. **Index Files**
Use index.js files to create clean imports:

```javascript
// src/services/index.js
export { OilPalmApiService } from './api/oilPalmApi';
export { LocalStorageService } from './storage/localStorage';
export { ImageValidatorService } from './validation/imageValidator';

// Usage in components
import { OilPalmApiService, ImageValidatorService } from '../services';
```

### 2. **Environment Configuration**
```javascript
// src/utils/constants.js
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  TIMEOUT: 30000,
  MAX_FILE_SIZE: 10 * 1024 * 1024
};
```

### 3. **Error Boundaries**
```javascript
// src/components/common/ErrorBoundary/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  // Error boundary implementation
}
```

This structure provides a solid foundation for your React app with proper service class integration, making it maintainable, scalable, and easy to test.