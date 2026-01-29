// Define the origin
const origin = { V4: { parents: 1, interior: 'Here' } };

const message = []; // Insert XCM Message Here

// Perform the dry run XCM call
const result = await api.call.dryRunApi.dryRunXcm(origin, message);
