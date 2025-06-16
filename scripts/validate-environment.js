// Environment Validation Script

const requiredEnvVars = {
  core: ["FIGMA_ACCESS_TOKEN", "GROQ_API_KEY", "NEXT_PUBLIC_GROQ_API_KEY", "GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
  optional: ["OPENAI_API_KEY", "OPENAI_MODEL", "NEXT_PUBLIC_ANALYTICS_ID"],
  application: ["NEXT_PUBLIC_APP_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL", "NODE_ENV"],
}

function validateEnvironment() {
  console.log("🔍 ENVIRONMENT VALIDATION")
  console.log("=".repeat(50))

  let coreValid = true
  let optionalCount = 0
  let appValid = true

  // Check Core Variables
  console.log("\n🎯 CORE SERVICES (Required):")
  requiredEnvVars.core.forEach((envVar) => {
    const value = process.env[envVar]
    const isValid = value && value.length > 0

    if (!isValid) coreValid = false

    console.log(`  ${envVar}: ${isValid ? "✅ SET" : "❌ MISSING"}`)

    if (isValid && envVar === "FIGMA_ACCESS_TOKEN") {
      console.log(`    Format: ${value.startsWith("figd_") ? "✅ Valid" : "⚠️ Check format"}`)
    }
    if (isValid && (envVar === "GROQ_API_KEY" || envVar === "NEXT_PUBLIC_GROQ_API_KEY")) {
      console.log(`    Format: ${value.startsWith("gsk_") ? "✅ Valid" : "⚠️ Check format"}`)
    }
  })

  // Check Optional Variables
  console.log("\n⚡ OPTIONAL SERVICES:")
  requiredEnvVars.optional.forEach((envVar) => {
    const value = process.env[envVar]
    const isValid = value && value.length > 0

    if (isValid) optionalCount++

    console.log(`  ${envVar}: ${isValid ? "✅ SET" : "⚠️ NOT SET"}`)

    if (isValid && envVar === "OPENAI_API_KEY") {
      console.log(`    Format: ${value.startsWith("sk-") ? "✅ Valid" : "⚠️ Check format"}`)
    }
  })

  // Check Application Variables
  console.log("\n🔧 APPLICATION SETTINGS:")
  requiredEnvVars.application.forEach((envVar) => {
    const value = process.env[envVar]
    const isValid = value && value.length > 0

    if (!isValid) appValid = false

    console.log(`  ${envVar}: ${isValid ? "✅ SET" : "❌ MISSING"}`)
  })

  // Environment Details
  console.log("\n📊 ENVIRONMENT DETAILS:")
  console.log(`  Node Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`  App URL: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}`)

  // Service Availability
  console.log("\n🛠️ SERVICE AVAILABILITY:")
  console.log(`  Figma API: ${process.env.FIGMA_ACCESS_TOKEN ? "✅ Available" : "❌ Not configured"}`)
  console.log(`  Groq AI: ${process.env.GROQ_API_KEY ? "✅ Available" : "❌ Not configured"}`)
  console.log(`  OpenAI: ${process.env.OPENAI_API_KEY ? "✅ Available" : "⚠️ Optional"}`)
  console.log(`  GitHub OAuth: ${process.env.GITHUB_CLIENT_ID ? "✅ Available" : "❌ Not configured"}`)

  // Overall Status
  console.log("\n🏆 OVERALL STATUS:")
  if (coreValid && appValid) {
    console.log("  ✅ ALL CORE SERVICES CONFIGURED")
    console.log("  🚀 READY FOR DEVELOPMENT AND PRODUCTION")
  } else if (coreValid) {
    console.log("  ⚠️ CORE SERVICES READY")
    console.log("  🔧 APPLICATION SETTINGS NEED ATTENTION")
  } else {
    console.log("  ❌ CORE SERVICES NEED CONFIGURATION")
    console.log("  🚨 CANNOT START WITHOUT REQUIRED VARIABLES")
  }

  console.log(`\n📈 CONFIGURATION COMPLETENESS:`)
  const totalRequired = requiredEnvVars.core.length + requiredEnvVars.application.length
  const totalConfigured =
    (coreValid ? requiredEnvVars.core.length : 0) + (appValid ? requiredEnvVars.application.length : 0)
  const completeness = Math.round((totalConfigured / totalRequired) * 100)

  console.log(`  Required Variables: ${completeness}% (${totalConfigured}/${totalRequired})`)
  console.log(`  Optional Variables: ${optionalCount}/${requiredEnvVars.optional.length} configured`)

  // Vercel Deployment Readiness
  console.log("\n🚀 VERCEL DEPLOYMENT READINESS:")
  if (coreValid && appValid) {
    console.log("  ✅ READY FOR VERCEL DEPLOYMENT")
  } else {
    console.log("  ❌ NOT READY FOR VERCEL DEPLOYMENT")
    console.log("  🔧 Fix the issues above before deploying to Vercel")
  }

  // Recommendations
  console.log("\n💡 RECOMMENDATIONS:")
  if (!coreValid) {
    console.log("  1. 🚨 Configure missing core environment variables")
    console.log("  2. 📋 Check .env.local file exists and is properly formatted")
    console.log("  3. 🔄 Restart development server after adding variables")
  } else {
    console.log("  1. ✅ Core configuration is complete!")
    console.log("  2. 🚀 Ready to start development")
    console.log("  3. 💡 Consider adding optional services for enhanced features")
  }

  // Next Steps
  console.log("\n🎯 NEXT STEPS:")
  if (coreValid && appValid) {
    console.log("  1. npm run dev - Start development server")
    console.log("  2. Open http://localhost:3000")
    console.log("  3. Begin converting Figma designs!")
  } else {
    console.log("  1. Complete environment variable setup")
    console.log("  2. Run validation again: npm run validate:env")
    console.log("  3. Start development when all core variables are set")
  }

  console.log("\n" + "=".repeat(50))

  return coreValid && appValid
}

// Run validation
const isValid = validateEnvironment()

if (isValid) {
  console.log("✅ Environment validation PASSED!")
  console.log("Your application is ready for Vercel deployment.")
} else {
  console.log("❌ Environment validation FAILED!")
  console.log("Please configure missing environment variables before proceeding.")

  // Don't exit with error in production to allow partial functionality
  if (process.env.NODE_ENV !== "production") {
    process.exit(1)
  }
}
