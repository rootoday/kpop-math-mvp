// Quick test to verify Supabase connection and data
require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('📋 Environment check:')
console.log('   URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
console.log('   Key:', supabaseKey ? '✅ Found' : '❌ Missing')
console.log('')

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    console.error('   Make sure .env.local exists and has:')
    console.error('   - NEXT_PUBLIC_SUPABASE_URL')
    console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    console.log('🔍 Testing Supabase connection...\n')

    try {
        // Test 1: Check lessons table
        console.log('1️⃣ Checking lessons table...')
        const { data: lessons, error: lessonsError } = await supabase
            .from('lessons')
            .select('id, title, artist, difficulty')

        if (lessonsError) {
            console.error('❌ Error fetching lessons:', lessonsError.message)
            return false
        }

        console.log(`✅ Found ${lessons.length} lesson(s)`)
        if (lessons.length > 0) {
            console.log(`   - "${lessons[0].title}" by ${lessons[0].artist}`)
        }

        // Test 2: Check users table structure
        console.log('\n2️⃣ Checking users table...')
        const { error: usersError } = await supabase
            .from('users')
            .select('id')
            .limit(1)

        if (usersError && !usersError.message.includes('0 rows')) {
            console.error('❌ Error accessing users table:', usersError.message)
            return false
        }
        console.log('✅ Users table accessible')

        // Test 3: Check user_progress table
        console.log('\n3️⃣ Checking user_progress table...')
        const { error: progressError } = await supabase
            .from('user_progress')
            .select('id')
            .limit(1)

        if (progressError && !progressError.message.includes('0 rows')) {
            console.error('❌ Error accessing user_progress table:', progressError.message)
            return false
        }
        console.log('✅ User progress table accessible')

        console.log('\n🎉 All checks passed! Database is ready.\n')
        console.log('Next step: Run "npm run dev" to start the application!')
        return true

    } catch (error) {
        console.error('❌ Unexpected error:', error.message)
        return false
    }
}

testConnection()
