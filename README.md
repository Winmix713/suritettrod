# 🎨 Figma to React Converter

> Transform your Figma designs into production-ready React components with AI-powered code generation.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/figma-converter)

## ✨ Features

- **🎯 Multi-Step Wizard**: Intuitive 5-step conversion process
- **🤖 AI-Powered**: Groq and OpenAI integration for intelligent code generation
- **📚 Template Library**: 12+ pre-built component templates
- **🔄 Real-time Preview**: Live JSX preview with syntax highlighting
- **📦 Multiple Export Options**: TSX, JSX, Vue, Angular, and more
- **🐙 GitHub Integration**: Direct repository creation and deployment
- **🎨 Figma API**: Full integration with Figma's REST API
- **⚡ Performance Optimized**: Built for speed and scalability

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/figma-converter.git
cd figma-converter
npm install
\`\`\`

### 2. Environment Setup

Copy the environment template and configure your API keys:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Required environment variables:

\`\`\`env
# Figma Integration
FIGMA_ACCESS_TOKEN=figd_your_figma_token_here

# AI Providers
GROQ_API_KEY=gsk_your_groq_api_key_here
NEXT_PUBLIC_GROQ_API_KEY=gsk_your_groq_api_key_here

# GitHub Integration
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Application Settings
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3. Validate Environment

\`\`\`bash
npm run validate:env
\`\`\`

### 4. Start Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Configuration

### Figma Setup

1. Go to [Figma Settings](https://www.figma.com/settings)
2. Generate a Personal Access Token
3. Add it to your `.env.local` as `FIGMA_ACCESS_TOKEN`

### AI Provider Setup

#### Groq (Required)
1. Sign up at [Groq Console](https://console.groq.com)
2. Generate an API key
3. Add it to your environment variables

#### OpenAI (Optional)
1. Sign up at [OpenAI Platform](https://platform.openai.com)
2. Generate an API key
3. Add it to your environment variables

### GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
4. Add Client ID and Secret to your environment variables

## 🚀 Deployment

### Deploy to Vercel

1. **Automatic Deployment**:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/figma-converter)

2. **Manual Deployment**:
   \`\`\`bash
   npm run deploy
   \`\`\`

3. **Environment Variables**: Add all required environment variables in your Vercel project settings.

### Build Settings

- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node.js Version**: `18.x`

## 📖 Usage

### 1. Connect to Figma
- Enter your Figma file URL
- The system will automatically fetch your design

### 2. Choose Template
- Browse the template library
- Select the best match for your component
- AI will suggest optimal templates

### 3. AI Conversion
- Choose your AI provider (Groq/OpenAI)
- Customize generation settings
- Generate React code

### 4. Preview & Edit
- Review the generated code
- Make real-time edits
- Test component functionality

### 5. Export
- Choose export format (TSX, JSX, Vue, etc.)
- Download as ZIP
- Create GitHub repository
- Deploy to Vercel

## 🧪 Testing

\`\`\`bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Performance audit
npm run audit:performance

# Accessibility audit
npm run audit:accessibility
\`\`\`

## 📊 Performance

- **Build Time**: ~30s
- **Bundle Size**: <500KB gzipped
- **Lighthouse Score**: 95+
- **Core Web Vitals**: All green

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI**: Groq, OpenAI
- **Testing**: Vitest, Playwright
- **Deployment**: Vercel

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@figmaconverter.com
- 💬 Discord: [Join our community](https://discord.gg/figmaconverter)
- 📖 Documentation: [docs.figmaconverter.com](https://docs.figmaconverter.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/figma-converter/issues)

## 🙏 Acknowledgments

- [Figma](https://figma.com) for the amazing design API
- [Groq](https://groq.com) for lightning-fast AI inference
- [OpenAI](https://openai.com) for advanced AI capabilities
- [Vercel](https://vercel.com) for seamless deployment
- [shadcn/ui](https://ui.shadcn.com) for beautiful components

---

<div align="center">
  <strong>Transform your designs into code with AI ✨</strong>
</div>
