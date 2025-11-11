import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Test admin user - gerçek uygulamada veritabanında olmalı
const TEST_ADMIN = {
  email: 'admin@bgoody.com',
  password: '$2b$10$wvOZIoFQ0bhbINUr06WL5uz96rsl1.o9G4bvRQ3jPqb7LZZG2SlKq', // admin123
  name: 'Admin User',
  role: 'ADMIN'
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Test admin kontrolü
    if (email === TEST_ADMIN.email) {
      const isValidPassword = await bcrypt.compare(password, TEST_ADMIN.password)
      
      if (isValidPassword) {
        const token = jwt.sign(
          { 
            userId: 'admin', 
            email: TEST_ADMIN.email, 
            role: TEST_ADMIN.role 
          },
          JWT_SECRET,
          { expiresIn: '24h' }
        )

        return NextResponse.json({
          token,
          user: {
            id: 'admin',
            email: TEST_ADMIN.email,
            name: TEST_ADMIN.name,
            role: TEST_ADMIN.role
          }
        })
      }
    }

    // Gerçek uygulamada burada veritabanından admin kullanıcı kontrolü yapılır
    // const admin = await db.user.findFirst({
    //   where: { email, role: 'ADMIN' }
    // })

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}