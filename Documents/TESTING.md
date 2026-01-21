# CarWash Testing Guide

## Overview
This document explains the comprehensive testing setup for the CarWash application, including unit tests, integration tests, and how to run them.

## Testing Structure

### 1. **Unit Tests**
Tests that focus on individual components, utilities, and functions in isolation.

#### Component Tests
- **Location**: `src/app/component/__tests__/`
- **Examples**:
  - `NearbyStores.test.js` - Tests location detection, filtering, store fetching, and UI interactions
  - `Header.test.js` - Tests header rendering and navigation
  - `Login.test.js` - Tests form submission and authentication flow

**What's Tested**:
- Component rendering
- User interactions (clicks, input changes)
- State management
- Loading and error states
- Conditional rendering

#### Utility & Helper Tests
- **Location**: `src/app/__tests__/`
- **Files**:
  - `auth-utils.test.js` - Tests password hashing and JWT token creation/verification
  - `utils.test.js` - Tests distance calculations, data validation, price formatting

**What's Tested**:
- Password hashing with bcrypt
- JWT token generation and verification
- Distance calculations between coordinates
- Email and phone number validation
- Currency formatting and tax/discount calculations

#### Model Tests
- **Location**: `src/app/models/__tests__/`
- **Files**:
  - `schemas.test.js` - Tests database schema validation for Store, Booking, User, and Review models

**What's Tested**:
- Required fields validation
- Data type validation
- Rating range validation (0-5)
- Coordinate validation (latitude/longitude)
- Booking status validation

### 2. **Integration Tests**
Tests that verify how different parts of the application work together, especially API routes.

#### API Route Tests
- **Location**: `src/app/api/[route]/__tests__/route.test.js`
- **Examples**:
  - `src/app/api/stores/nearby/__tests__/route.test.js` - Tests geospatial queries and filtering
  - `src/app/api/booking/__tests__/route.test.js` - Tests booking creation and validation
  - `src/app/api/login/__tests__/route.test.js` - Tests authentication flow

**What's Tested**:
- API request handling
- Database operations
- Query parameter validation
- Error handling
- Authentication/authorization
- Response formatting

## Configuration Files

### `jest.config.js`
Main Jest configuration file that:
- Sets up Next.js environment
- Configures test file paths
- Sets coverage thresholds (50% minimum)
- Maps aliases (`@/` → `src/`)

### `jest.setup.js`
Initialization file that:
- Imports testing library DOM matchers
- Mocks Next.js router and navigation
- Mocks browser APIs (geolocation, fetch)

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode (auto-rerun on file changes)
```bash
npm run test:watch
```

### Run Tests with Coverage Report
```bash
npm run test:coverage
```

## Test Examples

### Component Test Example
```javascript
test('fetches and displays nearby stores', async () => {
  global.fetch.mockResolvedValueOnce({
    json: async () => ({
      success: true,
      data: mockStores,
      count: 2,
    }),
  })

  render(<NearbyStores />)

  await waitFor(() => {
    expect(screen.getByText('Downtown Car Wash')).toBeInTheDocument()
  })
})
```

### API Test Example
```javascript
test('creates a new booking with valid data', async () => {
  dbConnection.mockResolvedValueOnce(true)
  Booking.mockImplementationOnce(() => ({
    save: jest.fn().mockResolvedValueOnce({
      _id: 'booking123',
      ...mockBookingData,
    }),
  }))

  const response = await POST(req)
  const data = await response.json()

  expect(response.status).toBe(201)
  expect(data.success).toBe(true)
})
```

## Coverage Report
After running `npm run test:coverage`, view the coverage report:
- **Terminal**: Shows summary percentages
- **Coverage folder**: Generated HTML report in `coverage/lcov-report/index.html`

Current coverage thresholds:
- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

## Mocking Strategy

### Database Mocks
- MongoDB models are mocked to avoid actual database calls
- Mocked methods: `find()`, `findOne()`, `save()`, `lean()`

### External APIs
- `fetch` is globally mocked to prevent real HTTP requests
- Browser APIs like `navigator.geolocation` are mocked

### Next.js Specific
- Router is mocked for navigation testing
- Navigation hooks (`useRouter`, `usePathname`) are mocked

## Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what users see and do, not internal mechanics

2. **Use Descriptive Test Names**
   - Example: `test('displays error message when store fetch fails')`

3. **Mock External Dependencies**
   - Always mock API calls, database operations, and browser APIs

4. **Test Edge Cases**
   - Empty results, invalid inputs, errors, loading states

5. **Keep Tests Isolated**
   - Each test should be independent and runnable alone

6. **Use `waitFor` for Async Operations**
   - Wait for async operations to complete before assertions

## Extending Tests

### Adding a New Component Test
1. Create file: `src/app/component/__tests__/MyComponent.test.js`
2. Import component and testing utilities
3. Mock dependencies
4. Write test cases

### Adding a New API Test
1. Create file: `src/app/api/route/__tests__/route.test.js`
2. Mock database connection and models
3. Create test request object
4. Assert response and calls

## Common Issues & Solutions

### **Issue**: Tests fail with "Cannot find module"
**Solution**: Check `jest.config.js` module mapper aliases

### **Issue**: Async tests timeout
**Solution**: Increase timeout or ensure promises are awaited

### **Issue**: Mocks not working
**Solution**: Ensure mocks are defined before imports

## Next Steps

1. Run `npm run test:coverage` to see coverage
2. Add more tests for uncovered components
3. Set up CI/CD to run tests automatically
4. Monitor coverage percentage over time

---

**Total Test Files**: 10
**Total Test Cases**: 70+
**Coverage Areas**: Components, APIs, Utilities, Models, Authentication
