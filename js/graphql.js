// graphql.js - GraphQL queries and data handling

// Get GraphQL API Configuration with CORS proxy support
const getGraphQLApiUrl = () => {
    const baseUrl = window.CONFIG?.GRAPHQL_API_URL || 'https://((DOMAIN))/api/graphql-engine/v1/graphql';
    if (window.CONFIG?.USE_CORS_PROXY && window.CONFIG?.CORS_PROXY) {
        return window.CONFIG.CORS_PROXY + encodeURIComponent(baseUrl);
    }
    return baseUrl;
};

// Function to execute GraphQL queries with authentication
async function executeGraphQLQuery(query, variables = {}) {
    // Check if auth.js functions are available
    if (typeof getToken !== 'function') {
        throw new Error('Authentication module not loaded. Please ensure auth.js is loaded before graphql.js');
    }
    
    const token = getToken();
    
    if (!token) {
        throw new Error('No authentication token found');
    }

    try {
        const response = await fetch(getGraphQLApiUrl(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.errors) {
            throw new Error(`GraphQL error: ${data.errors.map(e => e.message).join(', ')}`);
        }

        return data.data;
    } catch (error) {
        console.error('GraphQL query failed:', error);
        throw error;
    }
}

// Basic Query: Get user information
async function getUserBasicInfo() {
    const query = `
        query {
            user {
                id
                login
                firstName
                lastName
                email
                createdAt
                updatedAt
            }
        }
    `;
    
    try {
        const data = await executeGraphQLQuery(query);
        // Handle both single user and array response formats
        return Array.isArray(data.user) ? data.user : (data.user ? [data.user] : []);
    } catch (error) {
        console.error('Failed to fetch user basic info:', error);
        throw error;
    }
}

// Query with Arguments: Get specific object information
async function getObjectInfo(objectId = 3323) {
    const query = `
        query($objectId: Int!) {
            object(where: { id: { _eq: $objectId }}) {
                id
                name
                type
                attrs
                createdAt
            }
        }
    `;
    
    try {
        const data = await executeGraphQLQuery(query, { objectId });
        return data.object;
    } catch (error) {
        console.error('Failed to fetch object info:', error);
        throw error;
    }
}

// Nested Query: Get results with user information
async function getUserResults() {
    const query = `
        query {
            result(order_by: { createdAt: desc }) {
                id
                grade
                type
                createdAt
                updatedAt
                path
                user {
                    id
                    login
                }
                object {
                    id
                    name
                    type
                }
            }
        }
    `;
    
    try {
        const data = await executeGraphQLQuery(query);
        return Array.isArray(data.result) ? data.result : [];
    } catch (error) {
        console.error('Failed to fetch user results:', error);
        // Return empty array instead of throwing to prevent cascade failures
        return [];
    }
}

// Get user XP transactions
async function getUserXPTransactions() {
    const query = `
        query {
            transaction(where: { type: { _eq: "xp" }}, order_by: { createdAt: desc }) {
                id
                type
                amount
                createdAt
                path
                object {
                    id
                    name
                    type
                }
                user {
                    id
                    login
                }
            }
        }
    `;
    
    try {
        const data = await executeGraphQLQuery(query);
        return Array.isArray(data.transaction) ? data.transaction : [];
    } catch (error) {
        console.error('Failed to fetch XP transactions:', error);
        // Return empty array instead of throwing to prevent cascade failures
        return [];
    }
}

// Get user progress data
async function getUserProgress() {
    const query = `
        query {
            progress(order_by: { createdAt: desc }) {
                id
                grade
                createdAt
                updatedAt
                path
                user {
                    id
                    login
                }
                object {
                    id
                    name
                    type
                }
            }
        }
    `;
    
    try {
        const data = await executeGraphQLQuery(query);
        return Array.isArray(data.progress) ? data.progress : [];
    } catch (error) {
        console.error('Failed to fetch user progress:', error);
        // Return empty array instead of throwing to prevent cascade failures
        return [];
    }
}

// Data transformation functions moved to config.js for better organization
// These functions are now available globally via UTILS object
