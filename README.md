# Anentaa - Job Search Assistant

## 🚀 Live Demo

Try Anentaa in action:

---

## 📖 About Anentaa

Anentaa is a web application designed to help job seekers efficiently track and organize their job applications. Say goodbye to scattered spreadsheets and hello to a streamlined, intuitive job search management system.

### Why Anentaa?

- **All-in-One Solution:** Track applications, manage resumes, and leverage AI-powered insights in one place
- **Self-Hosted:** Full control over your data - run it on your own server
- **Credit-Based System:** Flexible credit-based pricing model for accessing features
- **AI-Powered:** Get resume reviews, job matching scores, and personalized recommendations
- **Easy Setup:** Docker-based installation means you can be up and running in minutes

---

## ✨ Key Features

### 📝 Application Tracking
Keep a detailed record of all your job applications with:
- Company information and job titles
- Application dates and deadlines
- Current status tracking (Draft, Applied, Interview, Offer, Rejected, Expired, Archived)
- Job descriptions and requirements
- Source tracking (where you found the job)

### 📊 Activity Dashboard
Visualize your job search progress with:
- Weekly application charts
- Activity calendar view
- Company statistics and trends
- Goal progress tracking
- Recent applications overview

### 📄 Resume Management
Store and organize multiple resumes:
- Upload and manage multiple resume versions
- Structured resume builder with sections
- File upload support for existing resumes
- AI-powered resume review and improvement suggestions

### 🤖 AI Assistant
Leverage OpenAI to enhance your job search:
- **Resume Review:** Get detailed feedback on your resume including strengths, weaknesses, and ATS compatibility
- **Job Matching:** Compare your resume against job descriptions to get match scores and identify best-fit opportunities
- **Cover Letter Generation:** Generate personalized cover letters tailored to each job application

### 🔍 Advanced Features
- Activity logging with time tracking
- Company and location management
- Job source tracking
- Credit plans (Free, Freshers $29/month, Experience $99/month)
- Mobile-responsive design

---

## 🛠️ Installation

### Prerequisites

Before you begin, make sure you have:
- **Docker** and **Docker Compose** installed ([Install Docker](https://www.docker.com))
- Basic knowledge of environment variables (optional but recommended)
- MongoDB (included in Docker setup) or external MongoDB connection string

---

## 🚀 Quick Start with Docker

### Step 1: Clone the Repository

```bash
git clone https://github.com/Gsync/Anentaa.git
cd Anentaa
```

**Alternative:** Download the source code as a ZIP file from GitHub.

### Step 2: Configure Environment Variables (Optional)

Create a `.env.local` file in the root directory or modify the `docker-compose.yml` file:

```env
# Database
DATABASE_URL=mongodb://mongo:27017/Anentaa

# Authentication (generate a secret - see below)
AUTH_SECRET=your_generated_secret_here

# OpenAI API (required for AI features)
OPENAI_API_KEY=sk-your-openai-api-key

# Google OAuth (optional, for Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Stripe (optional, for credit plan features)
STRIPE_SECRET_KEY=sk-your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk-your-stripe-publishable-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk-your-stripe-publishable-key
```

#### Generate Auth Secret

You can generate a secure random string for `AUTH_SECRET` using one of these methods:

**Using npm:**
```bash
npm exec auth secret
```

**Or using OpenSSL (Linux/Mac):**
```bash
openssl rand -base64 33
```

### Step 3: Start the Application

Make sure Docker is running, then execute:

```bash
docker compose up
```

**What happens:**
- Docker Compose automatically sets up MongoDB
- The application starts on port 3000
- Database schema is initialized automatically
- You can access the app immediately

**Note:** First run may take a few moments as MongoDB initializes and the database schema is created.

### Step 4: Access Anentaa

Open your browser and navigate to:
**http://localhost:3000**

### Default Sign in (if using default setup)

If you're using the default Docker setup, you may need to create an account through the sign-up page.

---

## 🔧 Manual Installation (Without Docker)

If you prefer not to use Docker, you can run Anentaa manually:

### Requirements
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Set up Environment Variables**
Create a `.env.local` file with all required variables (see Step 2 above).

3. **Set up Database**
```bash
npx prisma generate
npx prisma db push
```

4. **Run Development Server**
```bash
npm run dev
```

5. **Access the Application**
Open http://localhost:3000 in your browser.

---

## 🔑 Environment Variables Explained

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MongoDB connection string | `mongodb://localhost:27017/Anentaa` |
| `AUTH_SECRET` | Secret for authentication | Generated random string |
| `NEXTAUTH_URL` | Base URL of your application | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret for NextAuth | Generated random string |

### Optional but Recommended

| Variable | Description | Required For |
|----------|-------------|--------------|
| `OPENAI_API_KEY` | OpenAI API key | AI features (resume review, job matching, cover letters) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Google sign-in |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Google sign-in |
| `STRIPE_SECRET_KEY` | Stripe secret key | Credit plan payments |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Credit plan payments |

---

## 🤖 AI Integration

Anentaa uses **OpenAI** for all AI-powered features. To enable these features, you must add your OpenAI API key.

### Supported Features
- ✅ Resume review and analysis
- ✅ Job matching with compatibility scores
- ✅ Cover letter generation

### Setting Up OpenAI

1. Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env.local` or Docker environment:
```env
OPENAI_API_KEY=sk-your-key-here
```

### Available Models

- **gpt-3.5-turbo** (default, cost-effective)
- **gpt-4o-mini** (recommended for better quality)
- Additional models can be configured in the AI Settings page

### Usage Tips

- Ensure resume and job description content doesn't contain special characters
- Keep input content within the model's context length (~3000 tokens)
- Avoid including unnecessary details in job descriptions for optimal results

---

## 💳 Credit Plans

Anentaa offers three credit plan tiers:

### Free Plan
- 10 job applications
- 1 resume
- 5 AI requests per month
- 5MB storage

### Freshers Plan - $29/month
- 50 job applications
- 5 resumes
- 50 AI requests per month
- 20MB storage

### Experience Plan - $99/month
- 500 job applications
- 20 resumes
- Unlimited AI requests
- 100MB storage

*Note: Credit plan features require Stripe integration.*

---

## 📁 Project Structure

```
Anentaa/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── (auth)/      # Authentication pages
│   │   ├── dashboard/   # Dashboard pages
│   │   └── api/         # API routes
│   ├── components/      # React components
│   ├── lib/            # Utility libraries
│   └── models/         # TypeScript models
├── prisma/             # Database schema
├── public/             # Static assets
└── docker-compose.yml  # Docker configuration
```

---

## 🛠️ Development

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio
```

---

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is already in use, change it in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change 3001 to your preferred port
```

### Database Connection Issues
- Check that MongoDB is running
- Verify `DATABASE_URL` is correct in your environment variables
- For Docker, ensure the MongoDB container is running: `docker ps`

### AI Features Not Working
- Verify `OPENAI_API_KEY` is set correctly
- Check your OpenAI account has credits available
- Review the API usage in your OpenAI dashboard

### Authentication Issues
- Ensure `AUTH_SECRET` and `NEXTAUTH_SECRET` are set
- Verify `NEXTAUTH_URL` matches your application URL
- Check Google OAuth credentials if using Google sign-in

---

## 📚 Documentation

For detailed documentation, including:
- User guides
- Deployment instructions (Vercel, AWS EC2)
- Frontend customization
- API configuration
- And more...

Visit the **[Documentation](./document/)** folder in this repository.

---

## 🤝 Contributing

Anentaa welcomes contributions! 

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is available for use.

---

## 🙏 Credits

Anentaa is built with amazing technologies:

- **[React](https://github.com/facebook/react)** - UI library
- **[Next.js](https://github.com/vercel/next.js)** - React framework
- **[Shadcn/ui](https://github.com/shadcn-ui/ui)** - UI components
- **[Prisma](https://github.com/prisma/prisma)** - Database ORM
- **[Tailwind CSS](https://github.com/tailwindlabs/tailwindcss)** - Styling
- **[MongoDB](https://github.com/mongodb/mongo)** - Database
- **[OpenAI](https://openai.com)** - AI capabilities
- **[LangChain](https://github.com/langchain-ai)** - AI framework
- **[Tiptap](https://github.com/ueberdosis/tiptap)** - Rich text editor
- **[Nivo](https://github.com/plouc/nivo)** - Data visualization

---

## ⚠️ Important Note

**Current Status:** Anentaa has been tested primarily in local environments. While it can be deployed to remote servers, it's recommended to thoroughly test all features in your specific environment before production use.

---

## 📞 Support

- **GitHub Issues:** Report bugs or request features on [GitHub Issues](https://github.com/Gsync/Anentaa/issues)
- **Live Demo:** Try the application at [careerhub.us](https://careerhub.us)
- **Documentation:** Check the [documentation folder](./document/) for detailed guides

---

**Made with ❤️ for job seekers everywhere**

*Happy job hunting! 🎯*
