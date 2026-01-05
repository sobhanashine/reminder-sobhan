// Test script for enhanced Gemini API
async function testGeminiAPI() {
    const testCases = [
        {
            name: "Test 1: No habits",
            habits: []
        },
        {
            name: "Test 2: Single habit - smoking",
            habits: [{ name: "سیگار", days: 5 }]
        },
        {
            name: "Test 3: Multiple habits",
            habits: [
                { name: "سیگار", days: 15 },
                { name: "قند", days: 7 },
                { name: "رسانه اجتماعی", days: 3 }
            ]
        },
        {
            name: "Test 4: Long streaks",
            habits: [
                { name: "ورزش", days: 45 },
                { name: "آب", days: 30 }
            ]
        }
    ];

    console.log('🧪 Testing Enhanced Gemini API...\n');

    for (const testCase of testCases) {
        console.log(`\n${testCase.name}:`);
        console.log('Habits:', JSON.stringify(testCase.habits, null, 2));
        
        try {
            const response = await fetch('http://localhost:3000/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ habits: testCase.habits })
            });

            const data = await response.json();
            console.log('✅ Response:', data);
            console.log('─'.repeat(60));
            
            // Wait a bit between requests to see different results
            await new Promise(resolve => setTimeout(resolve, 1000));
            
        } catch (error) {
            console.log('❌ Error:', error.message);
            console.log('─'.repeat(60));
        }
    }
    
    console.log('\n🎉 Test completed! Check the responses above to see fresh, unique messages.');
}

// Run the test
testGeminiAPI();