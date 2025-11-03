// graphql.js - GraphQL queries and data handling

// Get GraphQL API Configuration with CORS proxy support
const getGraphQLApiUrl = () => {
    const baseUrl = window.CONFIG?.GRAPHQL_API_URL;
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
    let token = localStorage.getItem('jwt_token');
    if (!token) return [];
    token = token.replace(/^"|"$/g, ''); // Clean token
    
    const query = `
    {
        user {
            id
            login
            firstName
            lastName
            email
            createdAt
            updatedAt
        }
    }`;
    
    try {
        const response = await fetch(getGraphQLApiUrl(), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });

        const result = await response.json();
        if (response.ok && result.data) {
            return Array.isArray(result.data.user) ? result.data.user : (result.data.user ? [result.data.user] : []);
        } else {
            console.error('GraphQL error:', result.errors);
            return [];
        }
    } catch (err) {
        console.error('Fetch user basic info error:', err);
        return [];
    }
}

// Query with Arguments: Get specific object information
async function getObjectInfo(objectId = 3323) {
    let token = localStorage.getItem('jwt_token');
    if (!token) return [];
    token = token.replace(/^"|"$/g, ''); // Clean token
    
    const query = `
    {
        object(where: { id: { _eq: ${objectId} }}) {
            id
            name
            type
            attrs
            createdAt
        }
    }`;
    
    try {
        const response = await fetch(getGraphQLApiUrl(), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });

        const result = await response.json();
        if (response.ok && result.data) {
            return result.data.object;
        } else {
            console.error('GraphQL error:', result.errors);
            return [];
        }
    } catch (err) {
        console.error('Fetch object info error:', err);
        return [];
    }
}

// Nested Query: Get results with user information
async function getUserResults() {
    let token = localStorage.getItem('jwt_token');
    if (!token) return [];
    token = token.replace(/^"|"$/g, ''); // Clean token
    
    const query = `
    {
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
    }`;
    
    try {
        const response = await fetch(getGraphQLApiUrl(), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });

        const result = await response.json();
        if (response.ok && result.data) {
            return Array.isArray(result.data.result) ? result.data.result : [];
        } else {
            console.error('GraphQL error:', result.errors);
            return [];
        }
    } catch (err) {
        console.error('Fetch user results error:', err);
        return [];
    }
}

// Get user XP transactions (ALL XP - kept for backward compatibility)
async function getUserXPTransactions() {
    let token = localStorage.getItem('jwt_token');
    if (!token) return [];
    token = token.replace(/^"|"$/g, ''); // Clean token
    
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
    }`;
    
    try {
        const response = await fetch(getGraphQLApiUrl(), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });

        const result = await response.json();
        if (response.ok && result.data) {
            return Array.isArray(result.data.transaction) ? result.data.transaction : [];
        } else {
            console.error('GraphQL error:', result.errors);
            return [];
        }
    } catch (err) {
        console.error('Fetch XP transactions error:', err);
        return [];
    }
}

// Helper function to fetch XP data with custom where clause
async function fetchXpData(whereClause, storageKey) {
    let token = localStorage.getItem('jwt_token');
    if (!token) return [];
    token = token.replace(/^"|"$/g, ''); // Clean token

    const query = `
    query {
        transaction(where: ${whereClause}, order_by: { createdAt: desc }) {
            path
            amount
            createdAt
            object {
                name
                type
            }
        }
    }`;

    try {
        const response = await fetch(getGraphQLApiUrl(), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });

        const result = await response.json();
        if (response.ok && result.data) {
            localStorage.setItem(storageKey, JSON.stringify(result.data.transaction));
            console.log(`${storageKey} saved:`, result.data.transaction);
            return Array.isArray(result.data.transaction) ? result.data.transaction : [];
        } else {
            console.error('GraphQL error:', result.errors);
            return [];
        }
    } catch (err) {
        console.error(`Fetch ${storageKey} error:`, err);
        return [];
    }
}

// Fetch XP from projects only (excludes checkpoints and piscine-js)
async function fetchUserProjectsXPData() {
    const where = `{
        _and: [
            { type: { _eq: "xp" } },
            { path: { _like: "/athens/div-01/%" } },
            { path: { _nlike: "/athens/div-01/checkpoint%" } },
            { path: { _nlike: "/athens/div-01/piscine-js%" } }
        ]
    }`;
    return await fetchXpData(where, 'userXPData');
}

// Fetch XP from checkpoints only
async function fetchUserCheckpointsXPData() {
    const where = `{
        _and: [
            { type: { _eq: "xp" } },
            { path: { _like: "/athens/div-01/checkpoint%" } }
        ]
    }`;
    return await fetchXpData(where, 'userCheckpointsXPData');
}

// Fetch XP from JS Piscine only
async function fetchJSPiscineXPData() {
    const where = `{
        _and: [
            { type: { _eq: "xp" } },
            { path: { _like: "/athens/div-01/piscine-js%" } }
        ]
    }`;
    return await fetchXpData(where, 'jspiscineXPData');
}

// Calculate total XP from all categories
function calculateTotalXP() {
    const projectsXp = JSON.parse(localStorage.getItem('userXPData') || '[]');
    const checkpointsXp = JSON.parse(localStorage.getItem('userCheckpointsXPData') || '[]');
    const piscineJsXp = JSON.parse(localStorage.getItem('jspiscineXPData') || '[]');

    const sumXp = (data) => data.reduce((sum, x) => sum + (x.amount || 0), 0);

    const totals = {
        projects: sumXp(projectsXp),
        checkpoints: sumXp(checkpointsXp),
        piscineJs: sumXp(piscineJsXp),
    };

    totals.total = totals.projects + totals.checkpoints + totals.piscineJs;

    console.table(totals);
    localStorage.setItem('totalXPStats', JSON.stringify(totals));

    return totals;
}

// Get user progress data
async function getUserProgress() {
    let token = localStorage.getItem('jwt_token');
    if (!token) return [];
    token = token.replace(/^"|"$/g, ''); // Clean token
    
    const query = `
    {
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
    }`;
    
    try {
        const response = await fetch(getGraphQLApiUrl(), {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });

        const result = await response.json();
        if (response.ok && result.data) {
            return Array.isArray(result.data.progress) ? result.data.progress : [];
        } else {
            console.error('GraphQL error:', result.errors);
            return [];
        }
    } catch (err) {
        console.error('Fetch user progress error:', err);
        return [];
    }
}

// Data transformation functions moved to config.js for better organization
// These functions are now available globally via UTILS object
